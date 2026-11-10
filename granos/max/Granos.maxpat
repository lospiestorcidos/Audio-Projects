{
 "patcher": {
  "fileversion": 1,
  "appversion": {
   "major": 8,
   "minor": 6,
   "revision": 0,
   "architecture": "x64",
   "modernui": 1
  },
  "classnamespace": "box",
  "rect": [
   60.0,
   100.0,
   520.0,
   400.0
  ],
  "bglocked": 0,
  "openinpresentation": 1,
  "default_fontsize": 12.0,
  "default_fontface": 0,
  "default_fontname": "Arial",
  "gridonopen": 1,
  "gridsize": [
   15.0,
   15.0
  ],
  "gridsnaponopen": 1,
  "objectsnaponopen": 1,
  "statusbarvisible": 2,
  "toolbarvisible": 1,
  "enablehscroll": 1,
  "enablevscroll": 1,
  "devicewidth": 0.0,
  "description": "Sintetizador granular Granos dentro de una pista de Live (web en jweb~).",
  "digest": "",
  "tags": "",
  "style": "",
  "subpatcher_template": "",
  "boxes": [
   {
    "box": {
     "id": "obj-title",
     "maxclass": "comment",
     "patching_rect": [
      20.0,
      20.0,
      150.0,
      24.0
     ],
     "numinlets": 1,
     "numoutlets": 0,
     "text": "GRANOS",
     "fontsize": 18.0,
     "fontface": 1,
     "presentation": 1,
     "presentation_rect": [
      14.0,
      12.0,
      150.0,
      26.0
     ]
    }
   },
   {
    "box": {
     "id": "obj-help",
     "maxclass": "comment",
     "patching_rect": [
      20.0,
      50.0,
      190.0,
      48.0
     ],
     "numinlets": 1,
     "numoutlets": 0,
     "text": "Pulsa «Abrir» para ver la interfaz. El sonido sale por esta pista.",
     "linecount": 3,
     "presentation": 1,
     "presentation_rect": [
      14.0,
      92.0,
      172.0,
      48.0
     ]
    }
   },
   {
    "box": {
     "id": "obj-btn",
     "maxclass": "textbutton",
     "patching_rect": [
      20.0,
      110.0,
      150.0,
      36.0
     ],
     "numinlets": 1,
     "numoutlets": 3,
     "text": "Abrir Granos",
     "outlettype": [
      "",
      "",
      "int"
     ],
     "mode": 0,
     "fontsize": 14.0,
     "parameter_enable": 0,
     "presentation": 1,
     "presentation_rect": [
      14.0,
      46.0,
      172.0,
      38.0
     ]
    }
   },
   {
    "box": {
     "id": "obj-open",
     "maxclass": "message",
     "patching_rect": [
      20.0,
      160.0,
      40.0,
      22.0
     ],
     "numinlets": 2,
     "numoutlets": 1,
     "text": "open",
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "obj-pc",
     "maxclass": "newobj",
     "patching_rect": [
      20.0,
      195.0,
      60.0,
      22.0
     ],
     "numinlets": 1,
     "numoutlets": 1,
     "text": "pcontrol",
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "obj-midi",
     "maxclass": "newobj",
     "patching_rect": [
      220.0,
      110.0,
      50.0,
      22.0
     ],
     "numinlets": 1,
     "numoutlets": 1,
     "text": "midiin",
     "outlettype": [
      "int"
     ]
    }
   },
   {
    "box": {
     "id": "obj-pre",
     "maxclass": "newobj",
     "patching_rect": [
      220.0,
      160.0,
      70.0,
      22.0
     ],
     "numinlets": 1,
     "numoutlets": 1,
     "text": "prepend b",
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "obj-ui",
     "maxclass": "newobj",
     "patching_rect": [
      120.0,
      240.0,
      80.0,
      22.0
     ],
     "numinlets": 1,
     "numoutlets": 2,
     "text": "p Granos",
     "outlettype": [
      "signal",
      "signal"
     ],
     "patcher": {
      "fileversion": 1,
      "appversion": {
       "major": 8,
       "minor": 6,
       "revision": 0,
       "architecture": "x64",
       "modernui": 1
      },
      "classnamespace": "box",
      "rect": [
       80.0,
       80.0,
       1000.0,
       640.0
      ],
      "bglocked": 0,
      "openinpresentation": 1,
      "default_fontsize": 12.0,
      "default_fontface": 0,
      "default_fontname": "Arial",
      "gridonopen": 1,
      "gridsize": [
       15.0,
       15.0
      ],
      "gridsnaponopen": 1,
      "objectsnaponopen": 1,
      "statusbarvisible": 0,
      "toolbarvisible": 0,
      "enablehscroll": 0,
      "enablevscroll": 0,
      "devicewidth": 0.0,
      "description": "",
      "digest": "",
      "tags": "",
      "style": "",
      "subpatcher_template": "",
      "boxes": [
       {
        "box": {
         "id": "ui-in",
         "maxclass": "inlet",
         "patching_rect": [
          30.0,
          20.0,
          30.0,
          30.0
         ],
         "numinlets": 0,
         "numoutlets": 1,
         "outlettype": [
          ""
         ],
         "comment": "Mensajes para la página (b <byte MIDI>)"
        }
       },
       {
        "box": {
         "id": "ui-web",
         "maxclass": "jweb~",
         "patching_rect": [
          30.0,
          70.0,
          1000.0,
          640.0
         ],
         "numinlets": 1,
         "numoutlets": 3,
         "outlettype": [
          "signal",
          "signal",
          ""
         ],
         "url": "https://lospiestorcidos.github.io/Recent-Projects/?ui=pages",
         "rendermode": 0,
         "presentation": 1,
         "presentation_rect": [
          0.0,
          0.0,
          1000.0,
          640.0
         ]
        }
       },
       {
        "box": {
         "id": "ui-outl",
         "maxclass": "outlet",
         "patching_rect": [
          30.0,
          730.0,
          30.0,
          30.0
         ],
         "numinlets": 1,
         "numoutlets": 0,
         "comment": "Audio izquierda"
        }
       },
       {
        "box": {
         "id": "ui-outr",
         "maxclass": "outlet",
         "patching_rect": [
          80.0,
          730.0,
          30.0,
          30.0
         ],
         "numinlets": 1,
         "numoutlets": 0,
         "comment": "Audio derecha"
        }
       }
      ],
      "lines": [
       {
        "patchline": {
         "source": [
          "ui-in",
          0
         ],
         "destination": [
          "ui-web",
          0
         ]
        }
       },
       {
        "patchline": {
         "source": [
          "ui-web",
          0
         ],
         "destination": [
          "ui-outl",
          0
         ]
        }
       },
       {
        "patchline": {
         "source": [
          "ui-web",
          1
         ],
         "destination": [
          "ui-outr",
          0
         ]
        }
       }
      ]
     }
    }
   },
   {
    "box": {
     "id": "obj-out",
     "maxclass": "newobj",
     "patching_rect": [
      120.0,
      300.0,
      80.0,
      22.0
     ],
     "numinlets": 2,
     "numoutlets": 2,
     "text": "plugout~ 1 2",
     "outlettype": [
      "signal",
      "signal"
     ]
    }
   }
  ],
  "lines": [
   {
    "patchline": {
     "source": [
      "obj-btn",
      0
     ],
     "destination": [
      "obj-open",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-open",
      0
     ],
     "destination": [
      "obj-pc",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-pc",
      0
     ],
     "destination": [
      "obj-ui",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-midi",
      0
     ],
     "destination": [
      "obj-pre",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-pre",
      0
     ],
     "destination": [
      "obj-ui",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-ui",
      0
     ],
     "destination": [
      "obj-out",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-ui",
      1
     ],
     "destination": [
      "obj-out",
      1
     ]
    }
   }
  ],
  "openrect": [
   0.0,
   0.0,
   200.0,
   169.0
  ],
  "title": "Granos",
  "latency": 0,
  "project": {
   "version": 1,
   "creationdate": 3605254137,
   "modificationdate": 3605254137,
   "viewrect": [
    0.0,
    0.0,
    300.0,
    500.0
   ],
   "autoorganize": 1,
   "hideprojectwindow": 1,
   "showdependencies": 1,
   "autolocalize": 0,
   "contents": {
    "patchers": {}
   },
   "layout": {},
   "searchpath": {},
   "detailsvisible": 0,
   "amxdtype": 1768515945,
   "readonly": 0,
   "devpathtype": 0,
   "devpath": ".",
   "sortmode": 0
  },
  "autosave": 0
 }
}