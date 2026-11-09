import Capacitor
import CoreAudioKit
import CoreMIDI
import UIKit

/// Controlador principal: registra el plugin MIDI local y fija la app en horizontal a pantalla completa.
class MainViewController: CAPBridgeViewController {
    override func capacitorDidLoad() {
        bridge?.registerPluginInstance(GranosMidiPlugin())
    }

    override var prefersStatusBarHidden: Bool { true }
    override var prefersHomeIndicatorAutoHidden: Bool { true }
    override var supportedInterfaceOrientations: UIInterfaceOrientationMask { .landscape }
}

/// Entrada MIDI con CoreMIDI (USB, Bluetooth y red), incluido MPE.
/// Envía a JavaScript el evento "midi" con tripletas [status, dato1, dato2, …]; la interpretación
/// (notas, pitch bend por canal, CC 74, presión) se hace en src/midi/parser.ts.
@objc(GranosMidiPlugin)
public class GranosMidiPlugin: CAPPlugin, CAPBridgedPlugin {
    public let identifier = "GranosMidiPlugin"
    public let jsName = "GranosMidi"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "start", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "listSources", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "showBluetooth", returnType: CAPPluginReturnPromise)
    ]

    private var client = MIDIClientRef()
    private var port = MIDIPortRef()
    private var connected = Set<MIDIEndpointRef>()
    private var started = false

    @objc func start(_ call: CAPPluginCall) {
        if !started {
            // El cliente avisa cuando se conecta o desconecta un dispositivo.
            var status = MIDIClientCreateWithBlock("Granos" as CFString, &client) { [weak self] note in
                if note.pointee.messageID == .msgSetupChanged {
                    DispatchQueue.main.async { self?.connectAll(notify: true) }
                }
            }
            guard status == noErr else {
                call.reject("No se pudo crear el cliente MIDI (\(status))")
                return
            }
            // Protocolo MIDI 1.0: suficiente para MPE (un canal por nota).
            status = MIDIInputPortCreateWithProtocol(client, "Granos In" as CFString, ._1_0, &port) { [weak self] list, _ in
                self?.receive(list)
            }
            guard status == noErr else {
                call.reject("No se pudo crear el puerto MIDI (\(status))")
                return
            }
            started = true
        }
        connectAll(notify: false)
        call.resolve(["sources": sourceNames()])
    }

    @objc func listSources(_ call: CAPPluginCall) {
        call.resolve(["sources": sourceNames()])
    }

    /// Panel del sistema para emparejar dispositivos MIDI Bluetooth.
    @objc func showBluetooth(_ call: CAPPluginCall) {
        DispatchQueue.main.async {
            let central = CABTMIDICentralViewController()
            central.navigationItem.rightBarButtonItem = UIBarButtonItem(
                barButtonSystemItem: .done, target: self, action: #selector(self.closeBluetooth))
            let nav = UINavigationController(rootViewController: central)
            nav.modalPresentationStyle = .formSheet
            self.bridge?.viewController?.present(nav, animated: true)
            call.resolve()
        }
    }

    @objc private func closeBluetooth() {
        bridge?.viewController?.dismiss(animated: true)
    }

    /// Conecta todas las fuentes MIDI presentes (las ya conectadas se ignoran).
    private func connectAll(notify: Bool) {
        var present = Set<MIDIEndpointRef>()
        for index in 0..<MIDIGetNumberOfSources() {
            let source = MIDIGetSource(index)
            present.insert(source)
            if !connected.contains(source), MIDIPortConnectSource(port, source, nil) == noErr {
                connected.insert(source)
            }
        }
        connected.formIntersection(present)
        if notify { notifyListeners("sources", data: ["sources": sourceNames()]) }
    }

    private func sourceNames() -> [String] {
        (0..<MIDIGetNumberOfSources()).map { index in
            var name: Unmanaged<CFString>?
            MIDIObjectGetStringProperty(MIDIGetSource(index), kMIDIPropertyDisplayName, &name)
            return (name?.takeRetainedValue() as String?) ?? "MIDI \(index + 1)"
        }
    }

    /// Llega en un hilo de CoreMIDI. Extrae los mensajes de voz de canal (UMP tipo 2).
    private func receive(_ list: UnsafePointer<MIDIEventList>) {
        var bytes: [Int] = []
        let wordsOffset = MemoryLayout<MIDIEventPacket>.offset(of: \MIDIEventPacket.words) ?? 12
        for packet in list.unsafeSequence() {
            let count = Int(packet.pointee.wordCount)
            let words = UnsafeRawPointer(packet).advanced(by: wordsOffset).assumingMemoryBound(to: UInt32.self)
            var index = 0
            while index < count {
                let word = words[index]
                switch (word >> 28) & 0xF {
                case 0x2: // mensaje de voz de canal MIDI 1.0: status, dato 1, dato 2
                    bytes.append(Int((word >> 16) & 0xFF))
                    bytes.append(Int((word >> 8) & 0x7F))
                    bytes.append(Int(word & 0x7F))
                    index += 1
                case 0x3, 0x4: index += 2
                case 0x5: index += 4
                default: index += 1
                }
            }
        }
        if bytes.isEmpty { return }
        DispatchQueue.main.async { self.notifyListeners("midi", data: ["bytes": bytes]) }
    }
}
