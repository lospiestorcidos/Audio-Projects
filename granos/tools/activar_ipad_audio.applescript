-- Activa el iPad como entrada de audio en «Configuración de Audio MIDI».
-- Equivale a abrir esa app y pulsar «Activar» junto al iPad. Pensado para lanzarlo con un atajo de teclado.
-- Necesita permiso de Accesibilidad (Ajustes del Sistema › Privacidad y seguridad › Accesibilidad).

property appId : "com.apple.audio.AudioMIDISetup"
property etiquetas : {"Activar", "Enable"} -- español / inglés

tell application id appId to activate
delay 1

set pulsados to 0
tell application "System Events"
	set proc to first process whose bundle identifier is appId
	tell proc
		set frontmost to true
		-- Si la ventana de dispositivos está cerrada, se abre con Cmd+1 (Ventana › Mostrar dispositivos de audio).
		repeat 20 times
			if (count of windows) > 0 then exit repeat
			delay 0.25
		end repeat
		if (count of windows) = 0 then
			keystroke "1" using {command down}
			delay 1
		end if
		if (count of windows) > 0 then
			-- Se buscan los botones «Activar»: solo los tienen los iPhone y iPad conectados.
			set elementos to entire contents of window 1
			repeat with e in elementos
				try
					if role of e is "AXButton" then
						if (name of e) is in etiquetas then
							click e
							set pulsados to pulsados + 1
						end if
					end if
				end try
			end repeat
		end if
	end tell
end tell

if pulsados > 0 then
	delay 2
	tell application id appId to quit
	display notification "iPad activado como entrada de audio" with title "Granos"
else
	display notification "No encuentro el botón Activar. ¿Está conectado y desbloqueado, o ya activado?" with title "Granos"
end if
