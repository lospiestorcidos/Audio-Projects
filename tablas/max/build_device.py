#!/usr/bin/env python3
"""Genera el instrumento de Max for Live «Tablas» (Tablas.amxd y Tablas.maxpat).

El dispositivo carga la web de Tablas dentro de [jweb~], saca su audio por la pista y le pasa
el MIDI de la pista. No necesita Max instalado para generarse: escribe el JSON del parche y el
contenedor .amxd directamente.

Uso:  python3 build_device.py [URL]
"""
import json
import os
import struct
import sys

URL = sys.argv[1] if len(sys.argv) > 1 else "https://lospiestorcidos.github.io/Recent-Projects/tablas/?ui=pages&host=max"
HERE = os.path.dirname(os.path.abspath(__file__))
UI_W, UI_H = 1000.0, 640.0  # tamaño de la ventana flotante con la interfaz
# Bancos de parámetros (los genera el test tests/maxparams.test.ts a partir del esquema de la app).
BANKS = json.load(open(os.path.join(HERE, "params.json"), encoding="utf-8"))


def box(oid, maxclass, rect, text=None, nin=1, nout=1, outtypes=None, **extra):
    b = {"id": oid, "maxclass": maxclass, "patching_rect": rect, "numinlets": nin, "numoutlets": nout}
    if text is not None:
        b["text"] = text
    if nout:
        b["outlettype"] = outtypes if outtypes is not None else [""] * nout
    b.update(extra)
    return {"box": b}


def line(src, out, dst, inn):
    return {"patchline": {"source": [src, out], "destination": [dst, inn]}}


def patcher(boxes, lines, rect, **extra):
    p = {
        "fileversion": 1,
        "appversion": {"major": 8, "minor": 6, "revision": 0, "architecture": "x64", "modernui": 1},
        "classnamespace": "box",
        "rect": rect,
        "bglocked": 0,
        "openinpresentation": 1,
        "default_fontsize": 12.0,
        "default_fontface": 0,
        "default_fontname": "Arial",
        "gridonopen": 1,
        "gridsize": [15.0, 15.0],
        "gridsnaponopen": 1,
        "objectsnaponopen": 1,
        "statusbarvisible": 2,
        "toolbarvisible": 1,
        "enablehscroll": 1,
        "enablevscroll": 1,
        "devicewidth": 0.0,
        "description": "",
        "digest": "",
        "tags": "",
        "style": "",
        "subpatcher_template": "",
        "boxes": boxes,
        "lines": lines,
    }
    p.update(extra)
    return p


def ui_subpatcher():
    """Ventana flotante: solo contiene el navegador con audio."""
    boxes = [
        box("ui-in", "inlet", [30.0, 20.0, 30.0, 30.0], nin=0, nout=1, comment="Mensajes para la página (b <byte MIDI>)"),
        # [jweb~]: navegador integrado cuyo audio sale como señal (izquierda, derecha) + salida de mensajes.
        box("ui-web", "jweb~", [30.0, 70.0, UI_W, UI_H], nin=1, nout=3, outtypes=["signal", "signal", ""],
            url=URL, rendermode=0, presentation=1, presentation_rect=[0.0, 0.0, UI_W, UI_H]),
        box("ui-outl", "outlet", [30.0, 730.0, 30.0, 30.0], nin=1, nout=0, comment="Audio izquierda"),
        box("ui-outr", "outlet", [80.0, 730.0, 30.0, 30.0], nin=1, nout=0, comment="Audio derecha"),
        box("ui-outm", "outlet", [130.0, 730.0, 30.0, 30.0], nin=1, nout=0, comment="Mensajes de la página"),
    ]
    lines = [
        line("ui-in", 0, "ui-web", 0),
        line("ui-web", 0, "ui-outl", 0),
        line("ui-web", 1, "ui-outr", 0),
        line("ui-web", 2, "ui-outm", 0),
    ]
    return patcher(boxes, lines, [80.0, 80.0, UI_W, UI_H],
                   toolbarvisible=0, statusbarvisible=0, enablehscroll=0, enablevscroll=0)


def add_parameters(boxes, lines):
    """Un live.dial por parámetro (ocultos: solo existen para Live, la automatización y los
    controladores como la APC64) y la definición de los bancos de 8.

    Flujo:  Live mueve un dial  → "p <id> <valor>" → página.
            La página cambia algo → "<id> <valor>" → [route] → "set <valor>" → dial (sin eco).
            La página arranca     → "ready" → todos los diales envían su valor → "synced".
    """
    flat = [p for b in BANKS for p in b["params"] if p]
    ids = [p["id"] for p in flat]
    # Mensajes que salen de la página: "ready" y uno por parámetro.
    boxes.append(box("obj-route", "newobj", [320.0, 300.0, 700.0, 22.0], text="route ready " + " ".join(ids),
                     nin=1, nout=len(ids) + 2))
    boxes.append(box("obj-rdy", "newobj", [320.0, 340.0, 40.0, 22.0], text="t b b", nin=1, nout=2,
                     outtypes=["bang", "bang"]))
    boxes.append(box("obj-synced", "message", [320.0, 380.0, 50.0, 22.0], text="synced", nin=2, nout=1))
    lines.append(line("obj-ui", 2, "obj-route", 0))
    lines.append(line("obj-route", 0, "obj-rdy", 0))
    lines.append(line("obj-rdy", 0, "obj-synced", 0))  # la salida izquierda se dispara la última
    lines.append(line("obj-synced", 0, "obj-ui", 0))

    registry = {}
    for k, p in enumerate(flat):
        pid, name = p["id"], p["name"]
        x, y = 320.0 + (k % 8) * 95.0, 430.0 + (k // 8) * 110.0
        valueof = {
            "parameter_longname": name, "parameter_shortname": name,
            "parameter_initial_enable": 1, "parameter_initial": [p["initial"]],
        }
        if p["options"]:
            valueof.update({"parameter_type": 2, "parameter_enum": p["options"], "parameter_mmax": len(p["options"]) - 1})
        elif p.get("range"):  # entero con su rango real (semitonos, voces, número de tabla…)
            valueof.update({"parameter_type": 1, "parameter_mmin": p["range"][0], "parameter_mmax": p["range"][1],
                            "parameter_unitstyle": 0})
        else:  # continuo: recorrido del control en porcentaje
            valueof.update({"parameter_type": 0, "parameter_mmin": 0.0, "parameter_mmax": 100.0, "parameter_unitstyle": 5})
        boxes.append(box(f"obj-d-{pid}", "live.dial", [x, y + 26.0, 44.0, 48.0], nin=1, nout=2, outtypes=["", "float"],
                         parameter_enable=1, varname=f"tablas_{pid}", saved_attribute_attributes={"valueof": valueof}))
        boxes.append(box(f"obj-s-{pid}", "newobj", [x, y, 80.0, 22.0], text="prepend set", nin=1, nout=1))
        boxes.append(box(f"obj-p-{pid}", "newobj", [x, y + 80.0, 90.0, 22.0], text=f"prepend p {pid}", nin=1, nout=1))
        lines.append(line("obj-route", k + 1, f"obj-s-{pid}", 0))
        lines.append(line(f"obj-s-{pid}", 0, f"obj-d-{pid}", 0))
        lines.append(line(f"obj-d-{pid}", 0, f"obj-p-{pid}", 0))
        lines.append(line(f"obj-p-{pid}", 0, "obj-ui", 0))
        lines.append(line("obj-rdy", 1, f"obj-d-{pid}", 0))  # "ready": el dial vuelve a enviar su valor
        registry[f"obj-d-{pid}"] = [name, name, 0]

    registry["parameterbanks"] = {
        str(i): {"index": i, "name": b["name"], "parameters": [(p["name"] if p else "-") for p in b["params"]]}
        for i, b in enumerate(BANKS)
    }
    registry["inherited_shortname"] = 1
    return registry


def main_patcher():
    boxes = [
        box("obj-title", "comment", [20.0, 20.0, 150.0, 24.0], text="GRANOS", nout=0,
            fontsize=18.0, fontface=1, presentation=1, presentation_rect=[14.0, 12.0, 150.0, 26.0]),
        box("obj-help", "comment", [20.0, 50.0, 190.0, 48.0], nout=0, linecount=3,
            text="Pulsa «Abrir» para ver la interfaz. El sonido sale por esta pista.",
            presentation=1, presentation_rect=[14.0, 92.0, 172.0, 48.0]),
        # Botón que abre la ventana con la interfaz.
        box("obj-btn", "textbutton", [20.0, 110.0, 150.0, 36.0], nout=3, outtypes=["", "", "int"],
            text="Abrir Tablas", mode=0, fontsize=14.0, parameter_enable=0,
            presentation=1, presentation_rect=[14.0, 46.0, 172.0, 38.0]),
        box("obj-open", "message", [20.0, 160.0, 40.0, 22.0], text="open", nin=2, nout=1),
        box("obj-pc", "newobj", [20.0, 195.0, 60.0, 22.0], text="pcontrol", nin=1, nout=1),
        # MIDI de la pista, byte a byte, hacia la página.
        box("obj-midi", "newobj", [220.0, 110.0, 50.0, 22.0], text="midiin", nin=1, nout=1, outtypes=["int"]),
        box("obj-pre", "newobj", [220.0, 160.0, 70.0, 22.0], text="prepend b", nin=1, nout=1),
        box("obj-ui", "newobj", [120.0, 240.0, 80.0, 22.0], text="p Tablas", nin=1, nout=3,
            outtypes=["signal", "signal", ""], patcher=ui_subpatcher()),
        box("obj-out", "newobj", [120.0, 300.0, 80.0, 22.0], text="plugout~ 1 2", nin=2, nout=2,
            outtypes=["signal", "signal"]),
    ]
    lines = [
        line("obj-btn", 0, "obj-open", 0),
        line("obj-open", 0, "obj-pc", 0),
        line("obj-pc", 0, "obj-ui", 0),
        line("obj-midi", 0, "obj-pre", 0),
        line("obj-pre", 0, "obj-ui", 0),
        line("obj-ui", 0, "obj-out", 0),
        line("obj-ui", 1, "obj-out", 1),
    ]
    params = add_parameters(boxes, lines)
    return patcher(
        boxes, lines, [60.0, 100.0, 1100.0, 760.0],
        parameters=params,
        openrect=[0.0, 0.0, 200.0, 169.0],
        title="Tablas",
        description="Sintetizador de tablas de ondas Tablas dentro de una pista de Live (web en jweb~).",
        latency=0,
        project={
            "version": 1, "creationdate": 3605254137, "modificationdate": 3605254137,
            "viewrect": [0.0, 0.0, 300.0, 500.0], "autoorganize": 1, "hideprojectwindow": 1,
            "showdependencies": 1, "autolocalize": 0, "contents": {"patchers": {}}, "layout": {},
            "searchpath": {}, "detailsvisible": 0,
            "amxdtype": int.from_bytes(b"iiii", "big"),  # instrumento
            "readonly": 0, "devpathtype": 0, "devpath": ".", "sortmode": 0,
        },
        autosave=0,
    )


def main():
    doc = {"patcher": main_patcher()}
    payload = json.dumps(doc, indent=1, ensure_ascii=False).encode("utf-8") + b"\n"
    # Contenedor .amxd: cabecera "ampf", tipo "iiii" (instrumento), bloque "meta" y bloque "ptch" con el JSON.
    amxd = (b"ampf" + struct.pack("<I", 4) + b"iiii"
            + b"meta" + struct.pack("<I", 4) + b"\x00\x00\x00\x00"
            + b"ptch" + struct.pack("<I", len(payload)) + payload)
    with open(os.path.join(HERE, "Tablas.amxd"), "wb") as f:
        f.write(amxd)
    with open(os.path.join(HERE, "Tablas.maxpat"), "w", encoding="utf-8") as f:
        json.dump(doc, f, indent=1, ensure_ascii=False)
    print("OK ->", HERE, "| URL:", URL)


if __name__ == "__main__":
    main()
