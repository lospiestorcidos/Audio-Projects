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
   1100.0,
   760.0
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
  "description": "Sintetizador de tablas de ondas Tablas dentro de una pista de Live (web en jweb~).",
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
     "text": "Abrir Tablas",
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
     "numoutlets": 3,
     "text": "p Tablas",
     "outlettype": [
      "signal",
      "signal",
      ""
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
         "url": "https://lospiestorcidos.github.io/Recent-Projects/tablas/?ui=pages&host=max",
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
       },
       {
        "box": {
         "id": "ui-outm",
         "maxclass": "outlet",
         "patching_rect": [
          130.0,
          730.0,
          30.0,
          30.0
         ],
         "numinlets": 1,
         "numoutlets": 0,
         "comment": "Mensajes de la página"
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
       },
       {
        "patchline": {
         "source": [
          "ui-web",
          2
         ],
         "destination": [
          "ui-outm",
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
   },
   {
    "box": {
     "id": "obj-route",
     "maxclass": "newobj",
     "patching_rect": [
      320.0,
      300.0,
      700.0,
      22.0
     ],
     "numinlets": 1,
     "numoutlets": 72,
     "text": "route ready o1Table o1Pos o1Fx o1Fx1 o1Fx2 o1Semi o1Fine o1Level o2Table o2Pos o2Fx o2Fx1 o2Fx2 o2Semi o2Fine o2Level subLevel subOct subTone uniMode uniVoices uniAmt oscSpread volume filterOn filterMode filterFreq filterRes filterWidth e1A e1D e1S e1R e1Key e2A e2D e2S e2R e2Key e3A e3D e3S e3R e3Key lfo1Mode lfo1Rate lfo1Shape lfo1Amount lfo1Stereo lfo1Quant lfo1Phase lfo1RandPhase lfo2Mode lfo2Rate lfo2Shape lfo2Amount lfo2Stereo lfo2Quant lfo2Phase lfo2RandPhase transpose pbRange mono glide bpm lfoModWheel lfo1Div lfo1Audio lfo2Div lfo2Audio",
     "outlettype": [
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      ""
     ]
    }
   },
   {
    "box": {
     "id": "obj-rdy",
     "maxclass": "newobj",
     "patching_rect": [
      320.0,
      340.0,
      40.0,
      22.0
     ],
     "numinlets": 1,
     "numoutlets": 2,
     "text": "t b b",
     "outlettype": [
      "bang",
      "bang"
     ]
    }
   },
   {
    "box": {
     "id": "obj-synced",
     "maxclass": "message",
     "patching_rect": [
      320.0,
      380.0,
      50.0,
      22.0
     ],
     "numinlets": 2,
     "numoutlets": 1,
     "text": "synced",
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "obj-d-o1Table",
     "maxclass": "live.dial",
     "patching_rect": [
      320.0,
      456.0,
      44.0,
      48.0
     ],
     "numinlets": 1,
     "numoutlets": 2,
     "outlettype": [
      "",
      "float"
     ],
     "parameter_enable": 1,
     "varname": "tablas_o1Table",
     "saved_attribute_attributes": {
      "valueof": {
       "parameter_longname": "O1 Table",
       "parameter_shortname": "O1 Table",
       "parameter_initial_enable": 1,
       "parameter_initial": [
        0
       ],
       "parameter_type": 1,
       "parameter_mmin": 0,
       "parameter_mmax": 63,
       "parameter_unitstyle": 0
      }
     }
    }
   },
   {
    "box": {
     "id": "obj-s-o1Table",
     "maxclass": "newobj",
     "patching_rect": [
      320.0,
      430.0,
      80.0,
      22.0
     ],
     "numinlets": 1,
     "numoutlets": 1,
     "text": "prepend set",
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "obj-p-o1Table",
     "maxclass": "newobj",
     "patching_rect": [
      320.0,
      510.0,
      90.0,
      22.0
     ],
     "numinlets": 1,
     "numoutlets": 1,
     "text": "prepend p o1Table",
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "obj-d-o1Pos",
     "maxclass": "live.dial",
     "patching_rect": [
      415.0,
      456.0,
      44.0,
      48.0
     ],
     "numinlets": 1,
     "numoutlets": 2,
     "outlettype": [
      "",
      "float"
     ],
     "parameter_enable": 1,
     "varname": "tablas_o1Pos",
     "saved_attribute_attributes": {
      "valueof": {
       "parameter_longname": "O1 Position",
       "parameter_shortname": "O1 Position",
       "parameter_initial_enable": 1,
       "parameter_initial": [
        0
       ],
       "parameter_type": 0,
       "parameter_mmin": 0.0,
       "parameter_mmax": 100.0,
       "parameter_unitstyle": 5
      }
     }
    }
   },
   {
    "box": {
     "id": "obj-s-o1Pos",
     "maxclass": "newobj",
     "patching_rect": [
      415.0,
      430.0,
      80.0,
      22.0
     ],
     "numinlets": 1,
     "numoutlets": 1,
     "text": "prepend set",
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "obj-p-o1Pos",
     "maxclass": "newobj",
     "patching_rect": [
      415.0,
      510.0,
      90.0,
      22.0
     ],
     "numinlets": 1,
     "numoutlets": 1,
     "text": "prepend p o1Pos",
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "obj-d-o1Fx",
     "maxclass": "live.dial",
     "patching_rect": [
      510.0,
      456.0,
      44.0,
      48.0
     ],
     "numinlets": 1,
     "numoutlets": 2,
     "outlettype": [
      "",
      "float"
     ],
     "parameter_enable": 1,
     "varname": "tablas_o1Fx",
     "saved_attribute_attributes": {
      "valueof": {
       "parameter_longname": "O1 FX Type",
       "parameter_shortname": "O1 FX Type",
       "parameter_initial_enable": 1,
       "parameter_initial": [
        0
       ],
       "parameter_type": 2,
       "parameter_enum": [
        "Off",
        "FM",
        "Classic",
        "Modern"
       ],
       "parameter_mmax": 3
      }
     }
    }
   },
   {
    "box": {
     "id": "obj-s-o1Fx",
     "maxclass": "newobj",
     "patching_rect": [
      510.0,
      430.0,
      80.0,
      22.0
     ],
     "numinlets": 1,
     "numoutlets": 1,
     "text": "prepend set",
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "obj-p-o1Fx",
     "maxclass": "newobj",
     "patching_rect": [
      510.0,
      510.0,
      90.0,
      22.0
     ],
     "numinlets": 1,
     "numoutlets": 1,
     "text": "prepend p o1Fx",
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "obj-d-o1Fx1",
     "maxclass": "live.dial",
     "patching_rect": [
      605.0,
      456.0,
      44.0,
      48.0
     ],
     "numinlets": 1,
     "numoutlets": 2,
     "outlettype": [
      "",
      "float"
     ],
     "parameter_enable": 1,
     "varname": "tablas_o1Fx1",
     "saved_attribute_attributes": {
      "valueof": {
       "parameter_longname": "O1 FX 1",
       "parameter_shortname": "O1 FX 1",
       "parameter_initial_enable": 1,
       "parameter_initial": [
        0
       ],
       "parameter_type": 0,
       "parameter_mmin": 0.0,
       "parameter_mmax": 100.0,
       "parameter_unitstyle": 5
      }
     }
    }
   },
   {
    "box": {
     "id": "obj-s-o1Fx1",
     "maxclass": "newobj",
     "patching_rect": [
      605.0,
      430.0,
      80.0,
      22.0
     ],
     "numinlets": 1,
     "numoutlets": 1,
     "text": "prepend set",
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "obj-p-o1Fx1",
     "maxclass": "newobj",
     "patching_rect": [
      605.0,
      510.0,
      90.0,
      22.0
     ],
     "numinlets": 1,
     "numoutlets": 1,
     "text": "prepend p o1Fx1",
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "obj-d-o1Fx2",
     "maxclass": "live.dial",
     "patching_rect": [
      700.0,
      456.0,
      44.0,
      48.0
     ],
     "numinlets": 1,
     "numoutlets": 2,
     "outlettype": [
      "",
      "float"
     ],
     "parameter_enable": 1,
     "varname": "tablas_o1Fx2",
     "saved_attribute_attributes": {
      "valueof": {
       "parameter_longname": "O1 FX 2",
       "parameter_shortname": "O1 FX 2",
       "parameter_initial_enable": 1,
       "parameter_initial": [
        0
       ],
       "parameter_type": 0,
       "parameter_mmin": 0.0,
       "parameter_mmax": 100.0,
       "parameter_unitstyle": 5
      }
     }
    }
   },
   {
    "box": {
     "id": "obj-s-o1Fx2",
     "maxclass": "newobj",
     "patching_rect": [
      700.0,
      430.0,
      80.0,
      22.0
     ],
     "numinlets": 1,
     "numoutlets": 1,
     "text": "prepend set",
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "obj-p-o1Fx2",
     "maxclass": "newobj",
     "patching_rect": [
      700.0,
      510.0,
      90.0,
      22.0
     ],
     "numinlets": 1,
     "numoutlets": 1,
     "text": "prepend p o1Fx2",
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "obj-d-o1Semi",
     "maxclass": "live.dial",
     "patching_rect": [
      795.0,
      456.0,
      44.0,
      48.0
     ],
     "numinlets": 1,
     "numoutlets": 2,
     "outlettype": [
      "",
      "float"
     ],
     "parameter_enable": 1,
     "varname": "tablas_o1Semi",
     "saved_attribute_attributes": {
      "valueof": {
       "parameter_longname": "O1 Semi",
       "parameter_shortname": "O1 Semi",
       "parameter_initial_enable": 1,
       "parameter_initial": [
        0
       ],
       "parameter_type": 1,
       "parameter_mmin": -24,
       "parameter_mmax": 24,
       "parameter_unitstyle": 0
      }
     }
    }
   },
   {
    "box": {
     "id": "obj-s-o1Semi",
     "maxclass": "newobj",
     "patching_rect": [
      795.0,
      430.0,
      80.0,
      22.0
     ],
     "numinlets": 1,
     "numoutlets": 1,
     "text": "prepend set",
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "obj-p-o1Semi",
     "maxclass": "newobj",
     "patching_rect": [
      795.0,
      510.0,
      90.0,
      22.0
     ],
     "numinlets": 1,
     "numoutlets": 1,
     "text": "prepend p o1Semi",
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "obj-d-o1Fine",
     "maxclass": "live.dial",
     "patching_rect": [
      890.0,
      456.0,
      44.0,
      48.0
     ],
     "numinlets": 1,
     "numoutlets": 2,
     "outlettype": [
      "",
      "float"
     ],
     "parameter_enable": 1,
     "varname": "tablas_o1Fine",
     "saved_attribute_attributes": {
      "valueof": {
       "parameter_longname": "O1 Fine",
       "parameter_shortname": "O1 Fine",
       "parameter_initial_enable": 1,
       "parameter_initial": [
        50
       ],
       "parameter_type": 0,
       "parameter_mmin": 0.0,
       "parameter_mmax": 100.0,
       "parameter_unitstyle": 5
      }
     }
    }
   },
   {
    "box": {
     "id": "obj-s-o1Fine",
     "maxclass": "newobj",
     "patching_rect": [
      890.0,
      430.0,
      80.0,
      22.0
     ],
     "numinlets": 1,
     "numoutlets": 1,
     "text": "prepend set",
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "obj-p-o1Fine",
     "maxclass": "newobj",
     "patching_rect": [
      890.0,
      510.0,
      90.0,
      22.0
     ],
     "numinlets": 1,
     "numoutlets": 1,
     "text": "prepend p o1Fine",
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "obj-d-o1Level",
     "maxclass": "live.dial",
     "patching_rect": [
      985.0,
      456.0,
      44.0,
      48.0
     ],
     "numinlets": 1,
     "numoutlets": 2,
     "outlettype": [
      "",
      "float"
     ],
     "parameter_enable": 1,
     "varname": "tablas_o1Level",
     "saved_attribute_attributes": {
      "valueof": {
       "parameter_longname": "O1 Level",
       "parameter_shortname": "O1 Level",
       "parameter_initial_enable": 1,
       "parameter_initial": [
        80
       ],
       "parameter_type": 0,
       "parameter_mmin": 0.0,
       "parameter_mmax": 100.0,
       "parameter_unitstyle": 5
      }
     }
    }
   },
   {
    "box": {
     "id": "obj-s-o1Level",
     "maxclass": "newobj",
     "patching_rect": [
      985.0,
      430.0,
      80.0,
      22.0
     ],
     "numinlets": 1,
     "numoutlets": 1,
     "text": "prepend set",
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "obj-p-o1Level",
     "maxclass": "newobj",
     "patching_rect": [
      985.0,
      510.0,
      90.0,
      22.0
     ],
     "numinlets": 1,
     "numoutlets": 1,
     "text": "prepend p o1Level",
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "obj-d-o2Table",
     "maxclass": "live.dial",
     "patching_rect": [
      320.0,
      566.0,
      44.0,
      48.0
     ],
     "numinlets": 1,
     "numoutlets": 2,
     "outlettype": [
      "",
      "float"
     ],
     "parameter_enable": 1,
     "varname": "tablas_o2Table",
     "saved_attribute_attributes": {
      "valueof": {
       "parameter_longname": "O2 Table",
       "parameter_shortname": "O2 Table",
       "parameter_initial_enable": 1,
       "parameter_initial": [
        3
       ],
       "parameter_type": 1,
       "parameter_mmin": 0,
       "parameter_mmax": 63,
       "parameter_unitstyle": 0
      }
     }
    }
   },
   {
    "box": {
     "id": "obj-s-o2Table",
     "maxclass": "newobj",
     "patching_rect": [
      320.0,
      540.0,
      80.0,
      22.0
     ],
     "numinlets": 1,
     "numoutlets": 1,
     "text": "prepend set",
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "obj-p-o2Table",
     "maxclass": "newobj",
     "patching_rect": [
      320.0,
      620.0,
      90.0,
      22.0
     ],
     "numinlets": 1,
     "numoutlets": 1,
     "text": "prepend p o2Table",
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "obj-d-o2Pos",
     "maxclass": "live.dial",
     "patching_rect": [
      415.0,
      566.0,
      44.0,
      48.0
     ],
     "numinlets": 1,
     "numoutlets": 2,
     "outlettype": [
      "",
      "float"
     ],
     "parameter_enable": 1,
     "varname": "tablas_o2Pos",
     "saved_attribute_attributes": {
      "valueof": {
       "parameter_longname": "O2 Position",
       "parameter_shortname": "O2 Position",
       "parameter_initial_enable": 1,
       "parameter_initial": [
        0
       ],
       "parameter_type": 0,
       "parameter_mmin": 0.0,
       "parameter_mmax": 100.0,
       "parameter_unitstyle": 5
      }
     }
    }
   },
   {
    "box": {
     "id": "obj-s-o2Pos",
     "maxclass": "newobj",
     "patching_rect": [
      415.0,
      540.0,
      80.0,
      22.0
     ],
     "numinlets": 1,
     "numoutlets": 1,
     "text": "prepend set",
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "obj-p-o2Pos",
     "maxclass": "newobj",
     "patching_rect": [
      415.0,
      620.0,
      90.0,
      22.0
     ],
     "numinlets": 1,
     "numoutlets": 1,
     "text": "prepend p o2Pos",
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "obj-d-o2Fx",
     "maxclass": "live.dial",
     "patching_rect": [
      510.0,
      566.0,
      44.0,
      48.0
     ],
     "numinlets": 1,
     "numoutlets": 2,
     "outlettype": [
      "",
      "float"
     ],
     "parameter_enable": 1,
     "varname": "tablas_o2Fx",
     "saved_attribute_attributes": {
      "valueof": {
       "parameter_longname": "O2 FX Type",
       "parameter_shortname": "O2 FX Type",
       "parameter_initial_enable": 1,
       "parameter_initial": [
        0
       ],
       "parameter_type": 2,
       "parameter_enum": [
        "Off",
        "FM",
        "Classic",
        "Modern"
       ],
       "parameter_mmax": 3
      }
     }
    }
   },
   {
    "box": {
     "id": "obj-s-o2Fx",
     "maxclass": "newobj",
     "patching_rect": [
      510.0,
      540.0,
      80.0,
      22.0
     ],
     "numinlets": 1,
     "numoutlets": 1,
     "text": "prepend set",
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "obj-p-o2Fx",
     "maxclass": "newobj",
     "patching_rect": [
      510.0,
      620.0,
      90.0,
      22.0
     ],
     "numinlets": 1,
     "numoutlets": 1,
     "text": "prepend p o2Fx",
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "obj-d-o2Fx1",
     "maxclass": "live.dial",
     "patching_rect": [
      605.0,
      566.0,
      44.0,
      48.0
     ],
     "numinlets": 1,
     "numoutlets": 2,
     "outlettype": [
      "",
      "float"
     ],
     "parameter_enable": 1,
     "varname": "tablas_o2Fx1",
     "saved_attribute_attributes": {
      "valueof": {
       "parameter_longname": "O2 FX 1",
       "parameter_shortname": "O2 FX 1",
       "parameter_initial_enable": 1,
       "parameter_initial": [
        0
       ],
       "parameter_type": 0,
       "parameter_mmin": 0.0,
       "parameter_mmax": 100.0,
       "parameter_unitstyle": 5
      }
     }
    }
   },
   {
    "box": {
     "id": "obj-s-o2Fx1",
     "maxclass": "newobj",
     "patching_rect": [
      605.0,
      540.0,
      80.0,
      22.0
     ],
     "numinlets": 1,
     "numoutlets": 1,
     "text": "prepend set",
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "obj-p-o2Fx1",
     "maxclass": "newobj",
     "patching_rect": [
      605.0,
      620.0,
      90.0,
      22.0
     ],
     "numinlets": 1,
     "numoutlets": 1,
     "text": "prepend p o2Fx1",
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "obj-d-o2Fx2",
     "maxclass": "live.dial",
     "patching_rect": [
      700.0,
      566.0,
      44.0,
      48.0
     ],
     "numinlets": 1,
     "numoutlets": 2,
     "outlettype": [
      "",
      "float"
     ],
     "parameter_enable": 1,
     "varname": "tablas_o2Fx2",
     "saved_attribute_attributes": {
      "valueof": {
       "parameter_longname": "O2 FX 2",
       "parameter_shortname": "O2 FX 2",
       "parameter_initial_enable": 1,
       "parameter_initial": [
        0
       ],
       "parameter_type": 0,
       "parameter_mmin": 0.0,
       "parameter_mmax": 100.0,
       "parameter_unitstyle": 5
      }
     }
    }
   },
   {
    "box": {
     "id": "obj-s-o2Fx2",
     "maxclass": "newobj",
     "patching_rect": [
      700.0,
      540.0,
      80.0,
      22.0
     ],
     "numinlets": 1,
     "numoutlets": 1,
     "text": "prepend set",
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "obj-p-o2Fx2",
     "maxclass": "newobj",
     "patching_rect": [
      700.0,
      620.0,
      90.0,
      22.0
     ],
     "numinlets": 1,
     "numoutlets": 1,
     "text": "prepend p o2Fx2",
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "obj-d-o2Semi",
     "maxclass": "live.dial",
     "patching_rect": [
      795.0,
      566.0,
      44.0,
      48.0
     ],
     "numinlets": 1,
     "numoutlets": 2,
     "outlettype": [
      "",
      "float"
     ],
     "parameter_enable": 1,
     "varname": "tablas_o2Semi",
     "saved_attribute_attributes": {
      "valueof": {
       "parameter_longname": "O2 Semi",
       "parameter_shortname": "O2 Semi",
       "parameter_initial_enable": 1,
       "parameter_initial": [
        0
       ],
       "parameter_type": 1,
       "parameter_mmin": -24,
       "parameter_mmax": 24,
       "parameter_unitstyle": 0
      }
     }
    }
   },
   {
    "box": {
     "id": "obj-s-o2Semi",
     "maxclass": "newobj",
     "patching_rect": [
      795.0,
      540.0,
      80.0,
      22.0
     ],
     "numinlets": 1,
     "numoutlets": 1,
     "text": "prepend set",
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "obj-p-o2Semi",
     "maxclass": "newobj",
     "patching_rect": [
      795.0,
      620.0,
      90.0,
      22.0
     ],
     "numinlets": 1,
     "numoutlets": 1,
     "text": "prepend p o2Semi",
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "obj-d-o2Fine",
     "maxclass": "live.dial",
     "patching_rect": [
      890.0,
      566.0,
      44.0,
      48.0
     ],
     "numinlets": 1,
     "numoutlets": 2,
     "outlettype": [
      "",
      "float"
     ],
     "parameter_enable": 1,
     "varname": "tablas_o2Fine",
     "saved_attribute_attributes": {
      "valueof": {
       "parameter_longname": "O2 Fine",
       "parameter_shortname": "O2 Fine",
       "parameter_initial_enable": 1,
       "parameter_initial": [
        50
       ],
       "parameter_type": 0,
       "parameter_mmin": 0.0,
       "parameter_mmax": 100.0,
       "parameter_unitstyle": 5
      }
     }
    }
   },
   {
    "box": {
     "id": "obj-s-o2Fine",
     "maxclass": "newobj",
     "patching_rect": [
      890.0,
      540.0,
      80.0,
      22.0
     ],
     "numinlets": 1,
     "numoutlets": 1,
     "text": "prepend set",
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "obj-p-o2Fine",
     "maxclass": "newobj",
     "patching_rect": [
      890.0,
      620.0,
      90.0,
      22.0
     ],
     "numinlets": 1,
     "numoutlets": 1,
     "text": "prepend p o2Fine",
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "obj-d-o2Level",
     "maxclass": "live.dial",
     "patching_rect": [
      985.0,
      566.0,
      44.0,
      48.0
     ],
     "numinlets": 1,
     "numoutlets": 2,
     "outlettype": [
      "",
      "float"
     ],
     "parameter_enable": 1,
     "varname": "tablas_o2Level",
     "saved_attribute_attributes": {
      "valueof": {
       "parameter_longname": "O2 Level",
       "parameter_shortname": "O2 Level",
       "parameter_initial_enable": 1,
       "parameter_initial": [
        0
       ],
       "parameter_type": 0,
       "parameter_mmin": 0.0,
       "parameter_mmax": 100.0,
       "parameter_unitstyle": 5
      }
     }
    }
   },
   {
    "box": {
     "id": "obj-s-o2Level",
     "maxclass": "newobj",
     "patching_rect": [
      985.0,
      540.0,
      80.0,
      22.0
     ],
     "numinlets": 1,
     "numoutlets": 1,
     "text": "prepend set",
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "obj-p-o2Level",
     "maxclass": "newobj",
     "patching_rect": [
      985.0,
      620.0,
      90.0,
      22.0
     ],
     "numinlets": 1,
     "numoutlets": 1,
     "text": "prepend p o2Level",
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "obj-d-subLevel",
     "maxclass": "live.dial",
     "patching_rect": [
      320.0,
      676.0,
      44.0,
      48.0
     ],
     "numinlets": 1,
     "numoutlets": 2,
     "outlettype": [
      "",
      "float"
     ],
     "parameter_enable": 1,
     "varname": "tablas_subLevel",
     "saved_attribute_attributes": {
      "valueof": {
       "parameter_longname": "Sub Level",
       "parameter_shortname": "Sub Level",
       "parameter_initial_enable": 1,
       "parameter_initial": [
        0
       ],
       "parameter_type": 0,
       "parameter_mmin": 0.0,
       "parameter_mmax": 100.0,
       "parameter_unitstyle": 5
      }
     }
    }
   },
   {
    "box": {
     "id": "obj-s-subLevel",
     "maxclass": "newobj",
     "patching_rect": [
      320.0,
      650.0,
      80.0,
      22.0
     ],
     "numinlets": 1,
     "numoutlets": 1,
     "text": "prepend set",
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "obj-p-subLevel",
     "maxclass": "newobj",
     "patching_rect": [
      320.0,
      730.0,
      90.0,
      22.0
     ],
     "numinlets": 1,
     "numoutlets": 1,
     "text": "prepend p subLevel",
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "obj-d-subOct",
     "maxclass": "live.dial",
     "patching_rect": [
      415.0,
      676.0,
      44.0,
      48.0
     ],
     "numinlets": 1,
     "numoutlets": 2,
     "outlettype": [
      "",
      "float"
     ],
     "parameter_enable": 1,
     "varname": "tablas_subOct",
     "saved_attribute_attributes": {
      "valueof": {
       "parameter_longname": "Sub Octave",
       "parameter_shortname": "Sub Octave",
       "parameter_initial_enable": 1,
       "parameter_initial": [
        1
       ],
       "parameter_type": 2,
       "parameter_enum": [
        "-2",
        "-1",
        "0"
       ],
       "parameter_mmax": 2
      }
     }
    }
   },
   {
    "box": {
     "id": "obj-s-subOct",
     "maxclass": "newobj",
     "patching_rect": [
      415.0,
      650.0,
      80.0,
      22.0
     ],
     "numinlets": 1,
     "numoutlets": 1,
     "text": "prepend set",
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "obj-p-subOct",
     "maxclass": "newobj",
     "patching_rect": [
      415.0,
      730.0,
      90.0,
      22.0
     ],
     "numinlets": 1,
     "numoutlets": 1,
     "text": "prepend p subOct",
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "obj-d-subTone",
     "maxclass": "live.dial",
     "patching_rect": [
      510.0,
      676.0,
      44.0,
      48.0
     ],
     "numinlets": 1,
     "numoutlets": 2,
     "outlettype": [
      "",
      "float"
     ],
     "parameter_enable": 1,
     "varname": "tablas_subTone",
     "saved_attribute_attributes": {
      "valueof": {
       "parameter_longname": "Sub Tone",
       "parameter_shortname": "Sub Tone",
       "parameter_initial_enable": 1,
       "parameter_initial": [
        0
       ],
       "parameter_type": 0,
       "parameter_mmin": 0.0,
       "parameter_mmax": 100.0,
       "parameter_unitstyle": 5
      }
     }
    }
   },
   {
    "box": {
     "id": "obj-s-subTone",
     "maxclass": "newobj",
     "patching_rect": [
      510.0,
      650.0,
      80.0,
      22.0
     ],
     "numinlets": 1,
     "numoutlets": 1,
     "text": "prepend set",
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "obj-p-subTone",
     "maxclass": "newobj",
     "patching_rect": [
      510.0,
      730.0,
      90.0,
      22.0
     ],
     "numinlets": 1,
     "numoutlets": 1,
     "text": "prepend p subTone",
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "obj-d-uniMode",
     "maxclass": "live.dial",
     "patching_rect": [
      605.0,
      676.0,
      44.0,
      48.0
     ],
     "numinlets": 1,
     "numoutlets": 2,
     "outlettype": [
      "",
      "float"
     ],
     "parameter_enable": 1,
     "varname": "tablas_uniMode",
     "saved_attribute_attributes": {
      "valueof": {
       "parameter_longname": "Unison Mode",
       "parameter_shortname": "Unison Mode",
       "parameter_initial_enable": 1,
       "parameter_initial": [
        0
       ],
       "parameter_type": 2,
       "parameter_enum": [
        "Clásico",
        "Posición",
        "Aleatorio"
       ],
       "parameter_mmax": 2
      }
     }
    }
   },
   {
    "box": {
     "id": "obj-s-uniMode",
     "maxclass": "newobj",
     "patching_rect": [
      605.0,
      650.0,
      80.0,
      22.0
     ],
     "numinlets": 1,
     "numoutlets": 1,
     "text": "prepend set",
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "obj-p-uniMode",
     "maxclass": "newobj",
     "patching_rect": [
      605.0,
      730.0,
      90.0,
      22.0
     ],
     "numinlets": 1,
     "numoutlets": 1,
     "text": "prepend p uniMode",
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "obj-d-uniVoices",
     "maxclass": "live.dial",
     "patching_rect": [
      700.0,
      676.0,
      44.0,
      48.0
     ],
     "numinlets": 1,
     "numoutlets": 2,
     "outlettype": [
      "",
      "float"
     ],
     "parameter_enable": 1,
     "varname": "tablas_uniVoices",
     "saved_attribute_attributes": {
      "valueof": {
       "parameter_longname": "Unison Voices",
       "parameter_shortname": "Unison Voices",
       "parameter_initial_enable": 1,
       "parameter_initial": [
        1
       ],
       "parameter_type": 1,
       "parameter_mmin": 1,
       "parameter_mmax": 8,
       "parameter_unitstyle": 0
      }
     }
    }
   },
   {
    "box": {
     "id": "obj-s-uniVoices",
     "maxclass": "newobj",
     "patching_rect": [
      700.0,
      650.0,
      80.0,
      22.0
     ],
     "numinlets": 1,
     "numoutlets": 1,
     "text": "prepend set",
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "obj-p-uniVoices",
     "maxclass": "newobj",
     "patching_rect": [
      700.0,
      730.0,
      90.0,
      22.0
     ],
     "numinlets": 1,
     "numoutlets": 1,
     "text": "prepend p uniVoices",
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "obj-d-uniAmt",
     "maxclass": "live.dial",
     "patching_rect": [
      795.0,
      676.0,
      44.0,
      48.0
     ],
     "numinlets": 1,
     "numoutlets": 2,
     "outlettype": [
      "",
      "float"
     ],
     "parameter_enable": 1,
     "varname": "tablas_uniAmt",
     "saved_attribute_attributes": {
      "valueof": {
       "parameter_longname": "Unison Amount",
       "parameter_shortname": "Unison Amount",
       "parameter_initial_enable": 1,
       "parameter_initial": [
        30
       ],
       "parameter_type": 0,
       "parameter_mmin": 0.0,
       "parameter_mmax": 100.0,
       "parameter_unitstyle": 5
      }
     }
    }
   },
   {
    "box": {
     "id": "obj-s-uniAmt",
     "maxclass": "newobj",
     "patching_rect": [
      795.0,
      650.0,
      80.0,
      22.0
     ],
     "numinlets": 1,
     "numoutlets": 1,
     "text": "prepend set",
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "obj-p-uniAmt",
     "maxclass": "newobj",
     "patching_rect": [
      795.0,
      730.0,
      90.0,
      22.0
     ],
     "numinlets": 1,
     "numoutlets": 1,
     "text": "prepend p uniAmt",
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "obj-d-oscSpread",
     "maxclass": "live.dial",
     "patching_rect": [
      890.0,
      676.0,
      44.0,
      48.0
     ],
     "numinlets": 1,
     "numoutlets": 2,
     "outlettype": [
      "",
      "float"
     ],
     "parameter_enable": 1,
     "varname": "tablas_oscSpread",
     "saved_attribute_attributes": {
      "valueof": {
       "parameter_longname": "Osc Stereo",
       "parameter_shortname": "Osc Stereo",
       "parameter_initial_enable": 1,
       "parameter_initial": [
        0
       ],
       "parameter_type": 0,
       "parameter_mmin": 0.0,
       "parameter_mmax": 100.0,
       "parameter_unitstyle": 5
      }
     }
    }
   },
   {
    "box": {
     "id": "obj-s-oscSpread",
     "maxclass": "newobj",
     "patching_rect": [
      890.0,
      650.0,
      80.0,
      22.0
     ],
     "numinlets": 1,
     "numoutlets": 1,
     "text": "prepend set",
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "obj-p-oscSpread",
     "maxclass": "newobj",
     "patching_rect": [
      890.0,
      730.0,
      90.0,
      22.0
     ],
     "numinlets": 1,
     "numoutlets": 1,
     "text": "prepend p oscSpread",
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "obj-d-volume",
     "maxclass": "live.dial",
     "patching_rect": [
      985.0,
      676.0,
      44.0,
      48.0
     ],
     "numinlets": 1,
     "numoutlets": 2,
     "outlettype": [
      "",
      "float"
     ],
     "parameter_enable": 1,
     "varname": "tablas_volume",
     "saved_attribute_attributes": {
      "valueof": {
       "parameter_longname": "Volume",
       "parameter_shortname": "Volume",
       "parameter_initial_enable": 1,
       "parameter_initial": [
        75
       ],
       "parameter_type": 0,
       "parameter_mmin": 0.0,
       "parameter_mmax": 100.0,
       "parameter_unitstyle": 5
      }
     }
    }
   },
   {
    "box": {
     "id": "obj-s-volume",
     "maxclass": "newobj",
     "patching_rect": [
      985.0,
      650.0,
      80.0,
      22.0
     ],
     "numinlets": 1,
     "numoutlets": 1,
     "text": "prepend set",
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "obj-p-volume",
     "maxclass": "newobj",
     "patching_rect": [
      985.0,
      730.0,
      90.0,
      22.0
     ],
     "numinlets": 1,
     "numoutlets": 1,
     "text": "prepend p volume",
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "obj-d-filterOn",
     "maxclass": "live.dial",
     "patching_rect": [
      320.0,
      786.0,
      44.0,
      48.0
     ],
     "numinlets": 1,
     "numoutlets": 2,
     "outlettype": [
      "",
      "float"
     ],
     "parameter_enable": 1,
     "varname": "tablas_filterOn",
     "saved_attribute_attributes": {
      "valueof": {
       "parameter_longname": "Filter On",
       "parameter_shortname": "Filter On",
       "parameter_initial_enable": 1,
       "parameter_initial": [
        1
       ],
       "parameter_type": 2,
       "parameter_enum": [
        "Off",
        "On"
       ],
       "parameter_mmax": 1
      }
     }
    }
   },
   {
    "box": {
     "id": "obj-s-filterOn",
     "maxclass": "newobj",
     "patching_rect": [
      320.0,
      760.0,
      80.0,
      22.0
     ],
     "numinlets": 1,
     "numoutlets": 1,
     "text": "prepend set",
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "obj-p-filterOn",
     "maxclass": "newobj",
     "patching_rect": [
      320.0,
      840.0,
      90.0,
      22.0
     ],
     "numinlets": 1,
     "numoutlets": 1,
     "text": "prepend p filterOn",
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "obj-d-filterMode",
     "maxclass": "live.dial",
     "patching_rect": [
      415.0,
      786.0,
      44.0,
      48.0
     ],
     "numinlets": 1,
     "numoutlets": 2,
     "outlettype": [
      "",
      "float"
     ],
     "parameter_enable": 1,
     "varname": "tablas_filterMode",
     "saved_attribute_attributes": {
      "valueof": {
       "parameter_longname": "Filter Type",
       "parameter_shortname": "Filter Type",
       "parameter_initial_enable": 1,
       "parameter_initial": [
        0
       ],
       "parameter_type": 2,
       "parameter_enum": [
        "LP 24",
        "LP 12",
        "LP→HP",
        "LP→Notch",
        "Notch",
        "Notch ×2",
        "HP→Notch",
        "HP 12",
        "HP 24"
       ],
       "parameter_mmax": 8
      }
     }
    }
   },
   {
    "box": {
     "id": "obj-s-filterMode",
     "maxclass": "newobj",
     "patching_rect": [
      415.0,
      760.0,
      80.0,
      22.0
     ],
     "numinlets": 1,
     "numoutlets": 1,
     "text": "prepend set",
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "obj-p-filterMode",
     "maxclass": "newobj",
     "patching_rect": [
      415.0,
      840.0,
      90.0,
      22.0
     ],
     "numinlets": 1,
     "numoutlets": 1,
     "text": "prepend p filterMode",
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "obj-d-filterFreq",
     "maxclass": "live.dial",
     "patching_rect": [
      510.0,
      786.0,
      44.0,
      48.0
     ],
     "numinlets": 1,
     "numoutlets": 2,
     "outlettype": [
      "",
      "float"
     ],
     "parameter_enable": 1,
     "varname": "tablas_filterFreq",
     "saved_attribute_attributes": {
      "valueof": {
       "parameter_longname": "Filter Freq",
       "parameter_shortname": "Filter Freq",
       "parameter_initial_enable": 1,
       "parameter_initial": [
        100
       ],
       "parameter_type": 0,
       "parameter_mmin": 0.0,
       "parameter_mmax": 100.0,
       "parameter_unitstyle": 5
      }
     }
    }
   },
   {
    "box": {
     "id": "obj-s-filterFreq",
     "maxclass": "newobj",
     "patching_rect": [
      510.0,
      760.0,
      80.0,
      22.0
     ],
     "numinlets": 1,
     "numoutlets": 1,
     "text": "prepend set",
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "obj-p-filterFreq",
     "maxclass": "newobj",
     "patching_rect": [
      510.0,
      840.0,
      90.0,
      22.0
     ],
     "numinlets": 1,
     "numoutlets": 1,
     "text": "prepend p filterFreq",
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "obj-d-filterRes",
     "maxclass": "live.dial",
     "patching_rect": [
      605.0,
      786.0,
      44.0,
      48.0
     ],
     "numinlets": 1,
     "numoutlets": 2,
     "outlettype": [
      "",
      "float"
     ],
     "parameter_enable": 1,
     "varname": "tablas_filterRes",
     "saved_attribute_attributes": {
      "valueof": {
       "parameter_longname": "Filter Reso",
       "parameter_shortname": "Filter Reso",
       "parameter_initial_enable": 1,
       "parameter_initial": [
        15
       ],
       "parameter_type": 0,
       "parameter_mmin": 0.0,
       "parameter_mmax": 100.0,
       "parameter_unitstyle": 5
      }
     }
    }
   },
   {
    "box": {
     "id": "obj-s-filterRes",
     "maxclass": "newobj",
     "patching_rect": [
      605.0,
      760.0,
      80.0,
      22.0
     ],
     "numinlets": 1,
     "numoutlets": 1,
     "text": "prepend set",
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "obj-p-filterRes",
     "maxclass": "newobj",
     "patching_rect": [
      605.0,
      840.0,
      90.0,
      22.0
     ],
     "numinlets": 1,
     "numoutlets": 1,
     "text": "prepend p filterRes",
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "obj-d-filterWidth",
     "maxclass": "live.dial",
     "patching_rect": [
      700.0,
      786.0,
      44.0,
      48.0
     ],
     "numinlets": 1,
     "numoutlets": 2,
     "outlettype": [
      "",
      "float"
     ],
     "parameter_enable": 1,
     "varname": "tablas_filterWidth",
     "saved_attribute_attributes": {
      "valueof": {
       "parameter_longname": "Filter Width",
       "parameter_shortname": "Filter Width",
       "parameter_initial_enable": 1,
       "parameter_initial": [
        37.5
       ],
       "parameter_type": 0,
       "parameter_mmin": 0.0,
       "parameter_mmax": 100.0,
       "parameter_unitstyle": 5
      }
     }
    }
   },
   {
    "box": {
     "id": "obj-s-filterWidth",
     "maxclass": "newobj",
     "patching_rect": [
      700.0,
      760.0,
      80.0,
      22.0
     ],
     "numinlets": 1,
     "numoutlets": 1,
     "text": "prepend set",
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "obj-p-filterWidth",
     "maxclass": "newobj",
     "patching_rect": [
      700.0,
      840.0,
      90.0,
      22.0
     ],
     "numinlets": 1,
     "numoutlets": 1,
     "text": "prepend p filterWidth",
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "obj-d-e1A",
     "maxclass": "live.dial",
     "patching_rect": [
      795.0,
      786.0,
      44.0,
      48.0
     ],
     "numinlets": 1,
     "numoutlets": 2,
     "outlettype": [
      "",
      "float"
     ],
     "parameter_enable": 1,
     "varname": "tablas_e1A",
     "saved_attribute_attributes": {
      "valueof": {
       "parameter_longname": "E1 Attack",
       "parameter_shortname": "E1 Attack",
       "parameter_initial_enable": 1,
       "parameter_initial": [
        16.25
       ],
       "parameter_type": 0,
       "parameter_mmin": 0.0,
       "parameter_mmax": 100.0,
       "parameter_unitstyle": 5
      }
     }
    }
   },
   {
    "box": {
     "id": "obj-s-e1A",
     "maxclass": "newobj",
     "patching_rect": [
      795.0,
      760.0,
      80.0,
      22.0
     ],
     "numinlets": 1,
     "numoutlets": 1,
     "text": "prepend set",
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "obj-p-e1A",
     "maxclass": "newobj",
     "patching_rect": [
      795.0,
      840.0,
      90.0,
      22.0
     ],
     "numinlets": 1,
     "numoutlets": 1,
     "text": "prepend p e1A",
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "obj-d-e1D",
     "maxclass": "live.dial",
     "patching_rect": [
      890.0,
      786.0,
      44.0,
      48.0
     ],
     "numinlets": 1,
     "numoutlets": 2,
     "outlettype": [
      "",
      "float"
     ],
     "parameter_enable": 1,
     "varname": "tablas_e1D",
     "saved_attribute_attributes": {
      "valueof": {
       "parameter_longname": "E1 Decay",
       "parameter_shortname": "E1 Decay",
       "parameter_initial_enable": 1,
       "parameter_initial": [
        56.49
       ],
       "parameter_type": 0,
       "parameter_mmin": 0.0,
       "parameter_mmax": 100.0,
       "parameter_unitstyle": 5
      }
     }
    }
   },
   {
    "box": {
     "id": "obj-s-e1D",
     "maxclass": "newobj",
     "patching_rect": [
      890.0,
      760.0,
      80.0,
      22.0
     ],
     "numinlets": 1,
     "numoutlets": 1,
     "text": "prepend set",
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "obj-p-e1D",
     "maxclass": "newobj",
     "patching_rect": [
      890.0,
      840.0,
      90.0,
      22.0
     ],
     "numinlets": 1,
     "numoutlets": 1,
     "text": "prepend p e1D",
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "obj-d-e1S",
     "maxclass": "live.dial",
     "patching_rect": [
      985.0,
      786.0,
      44.0,
      48.0
     ],
     "numinlets": 1,
     "numoutlets": 2,
     "outlettype": [
      "",
      "float"
     ],
     "parameter_enable": 1,
     "varname": "tablas_e1S",
     "saved_attribute_attributes": {
      "valueof": {
       "parameter_longname": "E1 Sustain",
       "parameter_shortname": "E1 Sustain",
       "parameter_initial_enable": 1,
       "parameter_initial": [
        100
       ],
       "parameter_type": 0,
       "parameter_mmin": 0.0,
       "parameter_mmax": 100.0,
       "parameter_unitstyle": 5
      }
     }
    }
   },
   {
    "box": {
     "id": "obj-s-e1S",
     "maxclass": "newobj",
     "patching_rect": [
      985.0,
      760.0,
      80.0,
      22.0
     ],
     "numinlets": 1,
     "numoutlets": 1,
     "text": "prepend set",
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "obj-p-e1S",
     "maxclass": "newobj",
     "patching_rect": [
      985.0,
      840.0,
      90.0,
      22.0
     ],
     "numinlets": 1,
     "numoutlets": 1,
     "text": "prepend p e1S",
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "obj-d-e1R",
     "maxclass": "live.dial",
     "patching_rect": [
      320.0,
      896.0,
      44.0,
      48.0
     ],
     "numinlets": 1,
     "numoutlets": 2,
     "outlettype": [
      "",
      "float"
     ],
     "parameter_enable": 1,
     "varname": "tablas_e1R",
     "saved_attribute_attributes": {
      "valueof": {
       "parameter_longname": "E1 Release",
       "parameter_shortname": "E1 Release",
       "parameter_initial_enable": 1,
       "parameter_initial": [
        51.84
       ],
       "parameter_type": 0,
       "parameter_mmin": 0.0,
       "parameter_mmax": 100.0,
       "parameter_unitstyle": 5
      }
     }
    }
   },
   {
    "box": {
     "id": "obj-s-e1R",
     "maxclass": "newobj",
     "patching_rect": [
      320.0,
      870.0,
      80.0,
      22.0
     ],
     "numinlets": 1,
     "numoutlets": 1,
     "text": "prepend set",
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "obj-p-e1R",
     "maxclass": "newobj",
     "patching_rect": [
      320.0,
      950.0,
      90.0,
      22.0
     ],
     "numinlets": 1,
     "numoutlets": 1,
     "text": "prepend p e1R",
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "obj-d-e1Key",
     "maxclass": "live.dial",
     "patching_rect": [
      415.0,
      896.0,
      44.0,
      48.0
     ],
     "numinlets": 1,
     "numoutlets": 2,
     "outlettype": [
      "",
      "float"
     ],
     "parameter_enable": 1,
     "varname": "tablas_e1Key",
     "saved_attribute_attributes": {
      "valueof": {
       "parameter_longname": "E1 Key",
       "parameter_shortname": "E1 Key",
       "parameter_initial_enable": 1,
       "parameter_initial": [
        50
       ],
       "parameter_type": 0,
       "parameter_mmin": 0.0,
       "parameter_mmax": 100.0,
       "parameter_unitstyle": 5
      }
     }
    }
   },
   {
    "box": {
     "id": "obj-s-e1Key",
     "maxclass": "newobj",
     "patching_rect": [
      415.0,
      870.0,
      80.0,
      22.0
     ],
     "numinlets": 1,
     "numoutlets": 1,
     "text": "prepend set",
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "obj-p-e1Key",
     "maxclass": "newobj",
     "patching_rect": [
      415.0,
      950.0,
      90.0,
      22.0
     ],
     "numinlets": 1,
     "numoutlets": 1,
     "text": "prepend p e1Key",
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "obj-d-e2A",
     "maxclass": "live.dial",
     "patching_rect": [
      510.0,
      896.0,
      44.0,
      48.0
     ],
     "numinlets": 1,
     "numoutlets": 2,
     "outlettype": [
      "",
      "float"
     ],
     "parameter_enable": 1,
     "varname": "tablas_e2A",
     "saved_attribute_attributes": {
      "valueof": {
       "parameter_longname": "E2 Attack",
       "parameter_shortname": "E2 Attack",
       "parameter_initial_enable": 1,
       "parameter_initial": [
        62.75
       ],
       "parameter_type": 0,
       "parameter_mmin": 0.0,
       "parameter_mmax": 100.0,
       "parameter_unitstyle": 5
      }
     }
    }
   },
   {
    "box": {
     "id": "obj-s-e2A",
     "maxclass": "newobj",
     "patching_rect": [
      510.0,
      870.0,
      80.0,
      22.0
     ],
     "numinlets": 1,
     "numoutlets": 1,
     "text": "prepend set",
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "obj-p-e2A",
     "maxclass": "newobj",
     "patching_rect": [
      510.0,
      950.0,
      90.0,
      22.0
     ],
     "numinlets": 1,
     "numoutlets": 1,
     "text": "prepend p e2A",
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "obj-d-e2D",
     "maxclass": "live.dial",
     "patching_rect": [
      605.0,
      896.0,
      44.0,
      48.0
     ],
     "numinlets": 1,
     "numoutlets": 2,
     "outlettype": [
      "",
      "float"
     ],
     "parameter_enable": 1,
     "varname": "tablas_e2D",
     "saved_attribute_attributes": {
      "valueof": {
       "parameter_longname": "E2 Decay",
       "parameter_shortname": "E2 Decay",
       "parameter_initial_enable": 1,
       "parameter_initial": [
        62.79
       ],
       "parameter_type": 0,
       "parameter_mmin": 0.0,
       "parameter_mmax": 100.0,
       "parameter_unitstyle": 5
      }
     }
    }
   },
   {
    "box": {
     "id": "obj-s-e2D",
     "maxclass": "newobj",
     "patching_rect": [
      605.0,
      870.0,
      80.0,
      22.0
     ],
     "numinlets": 1,
     "numoutlets": 1,
     "text": "prepend set",
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "obj-p-e2D",
     "maxclass": "newobj",
     "patching_rect": [
      605.0,
      950.0,
      90.0,
      22.0
     ],
     "numinlets": 1,
     "numoutlets": 1,
     "text": "prepend p e2D",
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "obj-d-e2S",
     "maxclass": "live.dial",
     "patching_rect": [
      700.0,
      896.0,
      44.0,
      48.0
     ],
     "numinlets": 1,
     "numoutlets": 2,
     "outlettype": [
      "",
      "float"
     ],
     "parameter_enable": 1,
     "varname": "tablas_e2S",
     "saved_attribute_attributes": {
      "valueof": {
       "parameter_longname": "E2 Sustain",
       "parameter_shortname": "E2 Sustain",
       "parameter_initial_enable": 1,
       "parameter_initial": [
        50
       ],
       "parameter_type": 0,
       "parameter_mmin": 0.0,
       "parameter_mmax": 100.0,
       "parameter_unitstyle": 5
      }
     }
    }
   },
   {
    "box": {
     "id": "obj-s-e2S",
     "maxclass": "newobj",
     "patching_rect": [
      700.0,
      870.0,
      80.0,
      22.0
     ],
     "numinlets": 1,
     "numoutlets": 1,
     "text": "prepend set",
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "obj-p-e2S",
     "maxclass": "newobj",
     "patching_rect": [
      700.0,
      950.0,
      90.0,
      22.0
     ],
     "numinlets": 1,
     "numoutlets": 1,
     "text": "prepend p e2S",
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "obj-d-e2R",
     "maxclass": "live.dial",
     "patching_rect": [
      795.0,
      896.0,
      44.0,
      48.0
     ],
     "numinlets": 1,
     "numoutlets": 2,
     "outlettype": [
      "",
      "float"
     ],
     "parameter_enable": 1,
     "varname": "tablas_e2R",
     "saved_attribute_attributes": {
      "valueof": {
       "parameter_longname": "E2 Release",
       "parameter_shortname": "E2 Release",
       "parameter_initial_enable": 1,
       "parameter_initial": [
        56.49
       ],
       "parameter_type": 0,
       "parameter_mmin": 0.0,
       "parameter_mmax": 100.0,
       "parameter_unitstyle": 5
      }
     }
    }
   },
   {
    "box": {
     "id": "obj-s-e2R",
     "maxclass": "newobj",
     "patching_rect": [
      795.0,
      870.0,
      80.0,
      22.0
     ],
     "numinlets": 1,
     "numoutlets": 1,
     "text": "prepend set",
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "obj-p-e2R",
     "maxclass": "newobj",
     "patching_rect": [
      795.0,
      950.0,
      90.0,
      22.0
     ],
     "numinlets": 1,
     "numoutlets": 1,
     "text": "prepend p e2R",
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "obj-d-e2Key",
     "maxclass": "live.dial",
     "patching_rect": [
      890.0,
      896.0,
      44.0,
      48.0
     ],
     "numinlets": 1,
     "numoutlets": 2,
     "outlettype": [
      "",
      "float"
     ],
     "parameter_enable": 1,
     "varname": "tablas_e2Key",
     "saved_attribute_attributes": {
      "valueof": {
       "parameter_longname": "E2 Key",
       "parameter_shortname": "E2 Key",
       "parameter_initial_enable": 1,
       "parameter_initial": [
        50
       ],
       "parameter_type": 0,
       "parameter_mmin": 0.0,
       "parameter_mmax": 100.0,
       "parameter_unitstyle": 5
      }
     }
    }
   },
   {
    "box": {
     "id": "obj-s-e2Key",
     "maxclass": "newobj",
     "patching_rect": [
      890.0,
      870.0,
      80.0,
      22.0
     ],
     "numinlets": 1,
     "numoutlets": 1,
     "text": "prepend set",
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "obj-p-e2Key",
     "maxclass": "newobj",
     "patching_rect": [
      890.0,
      950.0,
      90.0,
      22.0
     ],
     "numinlets": 1,
     "numoutlets": 1,
     "text": "prepend p e2Key",
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "obj-d-e3A",
     "maxclass": "live.dial",
     "patching_rect": [
      985.0,
      896.0,
      44.0,
      48.0
     ],
     "numinlets": 1,
     "numoutlets": 2,
     "outlettype": [
      "",
      "float"
     ],
     "parameter_enable": 1,
     "varname": "tablas_e3A",
     "saved_attribute_attributes": {
      "valueof": {
       "parameter_longname": "E3 Attack",
       "parameter_shortname": "E3 Attack",
       "parameter_initial_enable": 1,
       "parameter_initial": [
        62.75
       ],
       "parameter_type": 0,
       "parameter_mmin": 0.0,
       "parameter_mmax": 100.0,
       "parameter_unitstyle": 5
      }
     }
    }
   },
   {
    "box": {
     "id": "obj-s-e3A",
     "maxclass": "newobj",
     "patching_rect": [
      985.0,
      870.0,
      80.0,
      22.0
     ],
     "numinlets": 1,
     "numoutlets": 1,
     "text": "prepend set",
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "obj-p-e3A",
     "maxclass": "newobj",
     "patching_rect": [
      985.0,
      950.0,
      90.0,
      22.0
     ],
     "numinlets": 1,
     "numoutlets": 1,
     "text": "prepend p e3A",
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "obj-d-e3D",
     "maxclass": "live.dial",
     "patching_rect": [
      320.0,
      1006.0,
      44.0,
      48.0
     ],
     "numinlets": 1,
     "numoutlets": 2,
     "outlettype": [
      "",
      "float"
     ],
     "parameter_enable": 1,
     "varname": "tablas_e3D",
     "saved_attribute_attributes": {
      "valueof": {
       "parameter_longname": "E3 Decay",
       "parameter_shortname": "E3 Decay",
       "parameter_initial_enable": 1,
       "parameter_initial": [
        62.79
       ],
       "parameter_type": 0,
       "parameter_mmin": 0.0,
       "parameter_mmax": 100.0,
       "parameter_unitstyle": 5
      }
     }
    }
   },
   {
    "box": {
     "id": "obj-s-e3D",
     "maxclass": "newobj",
     "patching_rect": [
      320.0,
      980.0,
      80.0,
      22.0
     ],
     "numinlets": 1,
     "numoutlets": 1,
     "text": "prepend set",
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "obj-p-e3D",
     "maxclass": "newobj",
     "patching_rect": [
      320.0,
      1060.0,
      90.0,
      22.0
     ],
     "numinlets": 1,
     "numoutlets": 1,
     "text": "prepend p e3D",
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "obj-d-e3S",
     "maxclass": "live.dial",
     "patching_rect": [
      415.0,
      1006.0,
      44.0,
      48.0
     ],
     "numinlets": 1,
     "numoutlets": 2,
     "outlettype": [
      "",
      "float"
     ],
     "parameter_enable": 1,
     "varname": "tablas_e3S",
     "saved_attribute_attributes": {
      "valueof": {
       "parameter_longname": "E3 Sustain",
       "parameter_shortname": "E3 Sustain",
       "parameter_initial_enable": 1,
       "parameter_initial": [
        50
       ],
       "parameter_type": 0,
       "parameter_mmin": 0.0,
       "parameter_mmax": 100.0,
       "parameter_unitstyle": 5
      }
     }
    }
   },
   {
    "box": {
     "id": "obj-s-e3S",
     "maxclass": "newobj",
     "patching_rect": [
      415.0,
      980.0,
      80.0,
      22.0
     ],
     "numinlets": 1,
     "numoutlets": 1,
     "text": "prepend set",
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "obj-p-e3S",
     "maxclass": "newobj",
     "patching_rect": [
      415.0,
      1060.0,
      90.0,
      22.0
     ],
     "numinlets": 1,
     "numoutlets": 1,
     "text": "prepend p e3S",
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "obj-d-e3R",
     "maxclass": "live.dial",
     "patching_rect": [
      510.0,
      1006.0,
      44.0,
      48.0
     ],
     "numinlets": 1,
     "numoutlets": 2,
     "outlettype": [
      "",
      "float"
     ],
     "parameter_enable": 1,
     "varname": "tablas_e3R",
     "saved_attribute_attributes": {
      "valueof": {
       "parameter_longname": "E3 Release",
       "parameter_shortname": "E3 Release",
       "parameter_initial_enable": 1,
       "parameter_initial": [
        56.49
       ],
       "parameter_type": 0,
       "parameter_mmin": 0.0,
       "parameter_mmax": 100.0,
       "parameter_unitstyle": 5
      }
     }
    }
   },
   {
    "box": {
     "id": "obj-s-e3R",
     "maxclass": "newobj",
     "patching_rect": [
      510.0,
      980.0,
      80.0,
      22.0
     ],
     "numinlets": 1,
     "numoutlets": 1,
     "text": "prepend set",
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "obj-p-e3R",
     "maxclass": "newobj",
     "patching_rect": [
      510.0,
      1060.0,
      90.0,
      22.0
     ],
     "numinlets": 1,
     "numoutlets": 1,
     "text": "prepend p e3R",
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "obj-d-e3Key",
     "maxclass": "live.dial",
     "patching_rect": [
      605.0,
      1006.0,
      44.0,
      48.0
     ],
     "numinlets": 1,
     "numoutlets": 2,
     "outlettype": [
      "",
      "float"
     ],
     "parameter_enable": 1,
     "varname": "tablas_e3Key",
     "saved_attribute_attributes": {
      "valueof": {
       "parameter_longname": "E3 Key",
       "parameter_shortname": "E3 Key",
       "parameter_initial_enable": 1,
       "parameter_initial": [
        50
       ],
       "parameter_type": 0,
       "parameter_mmin": 0.0,
       "parameter_mmax": 100.0,
       "parameter_unitstyle": 5
      }
     }
    }
   },
   {
    "box": {
     "id": "obj-s-e3Key",
     "maxclass": "newobj",
     "patching_rect": [
      605.0,
      980.0,
      80.0,
      22.0
     ],
     "numinlets": 1,
     "numoutlets": 1,
     "text": "prepend set",
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "obj-p-e3Key",
     "maxclass": "newobj",
     "patching_rect": [
      605.0,
      1060.0,
      90.0,
      22.0
     ],
     "numinlets": 1,
     "numoutlets": 1,
     "text": "prepend p e3Key",
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "obj-d-lfo1Mode",
     "maxclass": "live.dial",
     "patching_rect": [
      700.0,
      1006.0,
      44.0,
      48.0
     ],
     "numinlets": 1,
     "numoutlets": 2,
     "outlettype": [
      "",
      "float"
     ],
     "parameter_enable": 1,
     "varname": "tablas_lfo1Mode",
     "saved_attribute_attributes": {
      "valueof": {
       "parameter_longname": "L1 Mode",
       "parameter_shortname": "L1 Mode",
       "parameter_initial_enable": 1,
       "parameter_initial": [
        0
       ],
       "parameter_type": 2,
       "parameter_enum": [
        "Libre",
        "Sync",
        "Audio"
       ],
       "parameter_mmax": 2
      }
     }
    }
   },
   {
    "box": {
     "id": "obj-s-lfo1Mode",
     "maxclass": "newobj",
     "patching_rect": [
      700.0,
      980.0,
      80.0,
      22.0
     ],
     "numinlets": 1,
     "numoutlets": 1,
     "text": "prepend set",
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "obj-p-lfo1Mode",
     "maxclass": "newobj",
     "patching_rect": [
      700.0,
      1060.0,
      90.0,
      22.0
     ],
     "numinlets": 1,
     "numoutlets": 1,
     "text": "prepend p lfo1Mode",
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "obj-d-lfo1Rate",
     "maxclass": "live.dial",
     "patching_rect": [
      795.0,
      1006.0,
      44.0,
      48.0
     ],
     "numinlets": 1,
     "numoutlets": 2,
     "outlettype": [
      "",
      "float"
     ],
     "parameter_enable": 1,
     "varname": "tablas_lfo1Rate",
     "saved_attribute_attributes": {
      "valueof": {
       "parameter_longname": "L1 Rate",
       "parameter_shortname": "L1 Rate",
       "parameter_initial_enable": 1,
       "parameter_initial": [
        60.59
       ],
       "parameter_type": 0,
       "parameter_mmin": 0.0,
       "parameter_mmax": 100.0,
       "parameter_unitstyle": 5
      }
     }
    }
   },
   {
    "box": {
     "id": "obj-s-lfo1Rate",
     "maxclass": "newobj",
     "patching_rect": [
      795.0,
      980.0,
      80.0,
      22.0
     ],
     "numinlets": 1,
     "numoutlets": 1,
     "text": "prepend set",
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "obj-p-lfo1Rate",
     "maxclass": "newobj",
     "patching_rect": [
      795.0,
      1060.0,
      90.0,
      22.0
     ],
     "numinlets": 1,
     "numoutlets": 1,
     "text": "prepend p lfo1Rate",
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "obj-d-lfo1Shape",
     "maxclass": "live.dial",
     "patching_rect": [
      890.0,
      1006.0,
      44.0,
      48.0
     ],
     "numinlets": 1,
     "numoutlets": 2,
     "outlettype": [
      "",
      "float"
     ],
     "parameter_enable": 1,
     "varname": "tablas_lfo1Shape",
     "saved_attribute_attributes": {
      "valueof": {
       "parameter_longname": "L1 Shape",
       "parameter_shortname": "L1 Shape",
       "parameter_initial_enable": 1,
       "parameter_initial": [
        0
       ],
       "parameter_type": 2,
       "parameter_enum": [
        "Sine",
        "Triangle",
        "Up",
        "Down",
        "Rect",
        "S&H",
        "Rand",
        "Move"
       ],
       "parameter_mmax": 7
      }
     }
    }
   },
   {
    "box": {
     "id": "obj-s-lfo1Shape",
     "maxclass": "newobj",
     "patching_rect": [
      890.0,
      980.0,
      80.0,
      22.0
     ],
     "numinlets": 1,
     "numoutlets": 1,
     "text": "prepend set",
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "obj-p-lfo1Shape",
     "maxclass": "newobj",
     "patching_rect": [
      890.0,
      1060.0,
      90.0,
      22.0
     ],
     "numinlets": 1,
     "numoutlets": 1,
     "text": "prepend p lfo1Shape",
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "obj-d-lfo1Amount",
     "maxclass": "live.dial",
     "patching_rect": [
      985.0,
      1006.0,
      44.0,
      48.0
     ],
     "numinlets": 1,
     "numoutlets": 2,
     "outlettype": [
      "",
      "float"
     ],
     "parameter_enable": 1,
     "varname": "tablas_lfo1Amount",
     "saved_attribute_attributes": {
      "valueof": {
       "parameter_longname": "L1 Amount",
       "parameter_shortname": "L1 Amount",
       "parameter_initial_enable": 1,
       "parameter_initial": [
        100
       ],
       "parameter_type": 0,
       "parameter_mmin": 0.0,
       "parameter_mmax": 100.0,
       "parameter_unitstyle": 5
      }
     }
    }
   },
   {
    "box": {
     "id": "obj-s-lfo1Amount",
     "maxclass": "newobj",
     "patching_rect": [
      985.0,
      980.0,
      80.0,
      22.0
     ],
     "numinlets": 1,
     "numoutlets": 1,
     "text": "prepend set",
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "obj-p-lfo1Amount",
     "maxclass": "newobj",
     "patching_rect": [
      985.0,
      1060.0,
      90.0,
      22.0
     ],
     "numinlets": 1,
     "numoutlets": 1,
     "text": "prepend p lfo1Amount",
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "obj-d-lfo1Stereo",
     "maxclass": "live.dial",
     "patching_rect": [
      320.0,
      1116.0,
      44.0,
      48.0
     ],
     "numinlets": 1,
     "numoutlets": 2,
     "outlettype": [
      "",
      "float"
     ],
     "parameter_enable": 1,
     "varname": "tablas_lfo1Stereo",
     "saved_attribute_attributes": {
      "valueof": {
       "parameter_longname": "L1 Stereo",
       "parameter_shortname": "L1 Stereo",
       "parameter_initial_enable": 1,
       "parameter_initial": [
        0
       ],
       "parameter_type": 2,
       "parameter_enum": [
        "0°",
        "90°",
        "180°"
       ],
       "parameter_mmax": 2
      }
     }
    }
   },
   {
    "box": {
     "id": "obj-s-lfo1Stereo",
     "maxclass": "newobj",
     "patching_rect": [
      320.0,
      1090.0,
      80.0,
      22.0
     ],
     "numinlets": 1,
     "numoutlets": 1,
     "text": "prepend set",
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "obj-p-lfo1Stereo",
     "maxclass": "newobj",
     "patching_rect": [
      320.0,
      1170.0,
      90.0,
      22.0
     ],
     "numinlets": 1,
     "numoutlets": 1,
     "text": "prepend p lfo1Stereo",
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "obj-d-lfo1Quant",
     "maxclass": "live.dial",
     "patching_rect": [
      415.0,
      1116.0,
      44.0,
      48.0
     ],
     "numinlets": 1,
     "numoutlets": 2,
     "outlettype": [
      "",
      "float"
     ],
     "parameter_enable": 1,
     "varname": "tablas_lfo1Quant",
     "saved_attribute_attributes": {
      "valueof": {
       "parameter_longname": "L1 Quant",
       "parameter_shortname": "L1 Quant",
       "parameter_initial_enable": 1,
       "parameter_initial": [
        0
       ],
       "parameter_type": 1,
       "parameter_mmin": 0,
       "parameter_mmax": 16,
       "parameter_unitstyle": 0
      }
     }
    }
   },
   {
    "box": {
     "id": "obj-s-lfo1Quant",
     "maxclass": "newobj",
     "patching_rect": [
      415.0,
      1090.0,
      80.0,
      22.0
     ],
     "numinlets": 1,
     "numoutlets": 1,
     "text": "prepend set",
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "obj-p-lfo1Quant",
     "maxclass": "newobj",
     "patching_rect": [
      415.0,
      1170.0,
      90.0,
      22.0
     ],
     "numinlets": 1,
     "numoutlets": 1,
     "text": "prepend p lfo1Quant",
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "obj-d-lfo1Phase",
     "maxclass": "live.dial",
     "patching_rect": [
      510.0,
      1116.0,
      44.0,
      48.0
     ],
     "numinlets": 1,
     "numoutlets": 2,
     "outlettype": [
      "",
      "float"
     ],
     "parameter_enable": 1,
     "varname": "tablas_lfo1Phase",
     "saved_attribute_attributes": {
      "valueof": {
       "parameter_longname": "L1 Phase",
       "parameter_shortname": "L1 Phase",
       "parameter_initial_enable": 1,
       "parameter_initial": [
        0
       ],
       "parameter_type": 0,
       "parameter_mmin": 0.0,
       "parameter_mmax": 100.0,
       "parameter_unitstyle": 5
      }
     }
    }
   },
   {
    "box": {
     "id": "obj-s-lfo1Phase",
     "maxclass": "newobj",
     "patching_rect": [
      510.0,
      1090.0,
      80.0,
      22.0
     ],
     "numinlets": 1,
     "numoutlets": 1,
     "text": "prepend set",
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "obj-p-lfo1Phase",
     "maxclass": "newobj",
     "patching_rect": [
      510.0,
      1170.0,
      90.0,
      22.0
     ],
     "numinlets": 1,
     "numoutlets": 1,
     "text": "prepend p lfo1Phase",
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "obj-d-lfo1RandPhase",
     "maxclass": "live.dial",
     "patching_rect": [
      605.0,
      1116.0,
      44.0,
      48.0
     ],
     "numinlets": 1,
     "numoutlets": 2,
     "outlettype": [
      "",
      "float"
     ],
     "parameter_enable": 1,
     "varname": "tablas_lfo1RandPhase",
     "saved_attribute_attributes": {
      "valueof": {
       "parameter_longname": "L1 Rnd Phase",
       "parameter_shortname": "L1 Rnd Phase",
       "parameter_initial_enable": 1,
       "parameter_initial": [
        0
       ],
       "parameter_type": 2,
       "parameter_enum": [
        "Off",
        "On"
       ],
       "parameter_mmax": 1
      }
     }
    }
   },
   {
    "box": {
     "id": "obj-s-lfo1RandPhase",
     "maxclass": "newobj",
     "patching_rect": [
      605.0,
      1090.0,
      80.0,
      22.0
     ],
     "numinlets": 1,
     "numoutlets": 1,
     "text": "prepend set",
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "obj-p-lfo1RandPhase",
     "maxclass": "newobj",
     "patching_rect": [
      605.0,
      1170.0,
      90.0,
      22.0
     ],
     "numinlets": 1,
     "numoutlets": 1,
     "text": "prepend p lfo1RandPhase",
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "obj-d-lfo2Mode",
     "maxclass": "live.dial",
     "patching_rect": [
      700.0,
      1116.0,
      44.0,
      48.0
     ],
     "numinlets": 1,
     "numoutlets": 2,
     "outlettype": [
      "",
      "float"
     ],
     "parameter_enable": 1,
     "varname": "tablas_lfo2Mode",
     "saved_attribute_attributes": {
      "valueof": {
       "parameter_longname": "L2 Mode",
       "parameter_shortname": "L2 Mode",
       "parameter_initial_enable": 1,
       "parameter_initial": [
        0
       ],
       "parameter_type": 2,
       "parameter_enum": [
        "Libre",
        "Sync",
        "Audio"
       ],
       "parameter_mmax": 2
      }
     }
    }
   },
   {
    "box": {
     "id": "obj-s-lfo2Mode",
     "maxclass": "newobj",
     "patching_rect": [
      700.0,
      1090.0,
      80.0,
      22.0
     ],
     "numinlets": 1,
     "numoutlets": 1,
     "text": "prepend set",
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "obj-p-lfo2Mode",
     "maxclass": "newobj",
     "patching_rect": [
      700.0,
      1170.0,
      90.0,
      22.0
     ],
     "numinlets": 1,
     "numoutlets": 1,
     "text": "prepend p lfo2Mode",
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "obj-d-lfo2Rate",
     "maxclass": "live.dial",
     "patching_rect": [
      795.0,
      1116.0,
      44.0,
      48.0
     ],
     "numinlets": 1,
     "numoutlets": 2,
     "outlettype": [
      "",
      "float"
     ],
     "parameter_enable": 1,
     "varname": "tablas_lfo2Rate",
     "saved_attribute_attributes": {
      "valueof": {
       "parameter_longname": "L2 Rate",
       "parameter_shortname": "L2 Rate",
       "parameter_initial_enable": 1,
       "parameter_initial": [
        39.41
       ],
       "parameter_type": 0,
       "parameter_mmin": 0.0,
       "parameter_mmax": 100.0,
       "parameter_unitstyle": 5
      }
     }
    }
   },
   {
    "box": {
     "id": "obj-s-lfo2Rate",
     "maxclass": "newobj",
     "patching_rect": [
      795.0,
      1090.0,
      80.0,
      22.0
     ],
     "numinlets": 1,
     "numoutlets": 1,
     "text": "prepend set",
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "obj-p-lfo2Rate",
     "maxclass": "newobj",
     "patching_rect": [
      795.0,
      1170.0,
      90.0,
      22.0
     ],
     "numinlets": 1,
     "numoutlets": 1,
     "text": "prepend p lfo2Rate",
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "obj-d-lfo2Shape",
     "maxclass": "live.dial",
     "patching_rect": [
      890.0,
      1116.0,
      44.0,
      48.0
     ],
     "numinlets": 1,
     "numoutlets": 2,
     "outlettype": [
      "",
      "float"
     ],
     "parameter_enable": 1,
     "varname": "tablas_lfo2Shape",
     "saved_attribute_attributes": {
      "valueof": {
       "parameter_longname": "L2 Shape",
       "parameter_shortname": "L2 Shape",
       "parameter_initial_enable": 1,
       "parameter_initial": [
        0
       ],
       "parameter_type": 2,
       "parameter_enum": [
        "Sine",
        "Triangle",
        "Up",
        "Down",
        "Rect",
        "S&H",
        "Rand",
        "Move"
       ],
       "parameter_mmax": 7
      }
     }
    }
   },
   {
    "box": {
     "id": "obj-s-lfo2Shape",
     "maxclass": "newobj",
     "patching_rect": [
      890.0,
      1090.0,
      80.0,
      22.0
     ],
     "numinlets": 1,
     "numoutlets": 1,
     "text": "prepend set",
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "obj-p-lfo2Shape",
     "maxclass": "newobj",
     "patching_rect": [
      890.0,
      1170.0,
      90.0,
      22.0
     ],
     "numinlets": 1,
     "numoutlets": 1,
     "text": "prepend p lfo2Shape",
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "obj-d-lfo2Amount",
     "maxclass": "live.dial",
     "patching_rect": [
      985.0,
      1116.0,
      44.0,
      48.0
     ],
     "numinlets": 1,
     "numoutlets": 2,
     "outlettype": [
      "",
      "float"
     ],
     "parameter_enable": 1,
     "varname": "tablas_lfo2Amount",
     "saved_attribute_attributes": {
      "valueof": {
       "parameter_longname": "L2 Amount",
       "parameter_shortname": "L2 Amount",
       "parameter_initial_enable": 1,
       "parameter_initial": [
        100
       ],
       "parameter_type": 0,
       "parameter_mmin": 0.0,
       "parameter_mmax": 100.0,
       "parameter_unitstyle": 5
      }
     }
    }
   },
   {
    "box": {
     "id": "obj-s-lfo2Amount",
     "maxclass": "newobj",
     "patching_rect": [
      985.0,
      1090.0,
      80.0,
      22.0
     ],
     "numinlets": 1,
     "numoutlets": 1,
     "text": "prepend set",
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "obj-p-lfo2Amount",
     "maxclass": "newobj",
     "patching_rect": [
      985.0,
      1170.0,
      90.0,
      22.0
     ],
     "numinlets": 1,
     "numoutlets": 1,
     "text": "prepend p lfo2Amount",
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "obj-d-lfo2Stereo",
     "maxclass": "live.dial",
     "patching_rect": [
      320.0,
      1226.0,
      44.0,
      48.0
     ],
     "numinlets": 1,
     "numoutlets": 2,
     "outlettype": [
      "",
      "float"
     ],
     "parameter_enable": 1,
     "varname": "tablas_lfo2Stereo",
     "saved_attribute_attributes": {
      "valueof": {
       "parameter_longname": "L2 Stereo",
       "parameter_shortname": "L2 Stereo",
       "parameter_initial_enable": 1,
       "parameter_initial": [
        0
       ],
       "parameter_type": 2,
       "parameter_enum": [
        "0°",
        "90°",
        "180°"
       ],
       "parameter_mmax": 2
      }
     }
    }
   },
   {
    "box": {
     "id": "obj-s-lfo2Stereo",
     "maxclass": "newobj",
     "patching_rect": [
      320.0,
      1200.0,
      80.0,
      22.0
     ],
     "numinlets": 1,
     "numoutlets": 1,
     "text": "prepend set",
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "obj-p-lfo2Stereo",
     "maxclass": "newobj",
     "patching_rect": [
      320.0,
      1280.0,
      90.0,
      22.0
     ],
     "numinlets": 1,
     "numoutlets": 1,
     "text": "prepend p lfo2Stereo",
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "obj-d-lfo2Quant",
     "maxclass": "live.dial",
     "patching_rect": [
      415.0,
      1226.0,
      44.0,
      48.0
     ],
     "numinlets": 1,
     "numoutlets": 2,
     "outlettype": [
      "",
      "float"
     ],
     "parameter_enable": 1,
     "varname": "tablas_lfo2Quant",
     "saved_attribute_attributes": {
      "valueof": {
       "parameter_longname": "L2 Quant",
       "parameter_shortname": "L2 Quant",
       "parameter_initial_enable": 1,
       "parameter_initial": [
        0
       ],
       "parameter_type": 1,
       "parameter_mmin": 0,
       "parameter_mmax": 16,
       "parameter_unitstyle": 0
      }
     }
    }
   },
   {
    "box": {
     "id": "obj-s-lfo2Quant",
     "maxclass": "newobj",
     "patching_rect": [
      415.0,
      1200.0,
      80.0,
      22.0
     ],
     "numinlets": 1,
     "numoutlets": 1,
     "text": "prepend set",
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "obj-p-lfo2Quant",
     "maxclass": "newobj",
     "patching_rect": [
      415.0,
      1280.0,
      90.0,
      22.0
     ],
     "numinlets": 1,
     "numoutlets": 1,
     "text": "prepend p lfo2Quant",
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "obj-d-lfo2Phase",
     "maxclass": "live.dial",
     "patching_rect": [
      510.0,
      1226.0,
      44.0,
      48.0
     ],
     "numinlets": 1,
     "numoutlets": 2,
     "outlettype": [
      "",
      "float"
     ],
     "parameter_enable": 1,
     "varname": "tablas_lfo2Phase",
     "saved_attribute_attributes": {
      "valueof": {
       "parameter_longname": "L2 Phase",
       "parameter_shortname": "L2 Phase",
       "parameter_initial_enable": 1,
       "parameter_initial": [
        0
       ],
       "parameter_type": 0,
       "parameter_mmin": 0.0,
       "parameter_mmax": 100.0,
       "parameter_unitstyle": 5
      }
     }
    }
   },
   {
    "box": {
     "id": "obj-s-lfo2Phase",
     "maxclass": "newobj",
     "patching_rect": [
      510.0,
      1200.0,
      80.0,
      22.0
     ],
     "numinlets": 1,
     "numoutlets": 1,
     "text": "prepend set",
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "obj-p-lfo2Phase",
     "maxclass": "newobj",
     "patching_rect": [
      510.0,
      1280.0,
      90.0,
      22.0
     ],
     "numinlets": 1,
     "numoutlets": 1,
     "text": "prepend p lfo2Phase",
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "obj-d-lfo2RandPhase",
     "maxclass": "live.dial",
     "patching_rect": [
      605.0,
      1226.0,
      44.0,
      48.0
     ],
     "numinlets": 1,
     "numoutlets": 2,
     "outlettype": [
      "",
      "float"
     ],
     "parameter_enable": 1,
     "varname": "tablas_lfo2RandPhase",
     "saved_attribute_attributes": {
      "valueof": {
       "parameter_longname": "L2 Rnd Phase",
       "parameter_shortname": "L2 Rnd Phase",
       "parameter_initial_enable": 1,
       "parameter_initial": [
        0
       ],
       "parameter_type": 2,
       "parameter_enum": [
        "Off",
        "On"
       ],
       "parameter_mmax": 1
      }
     }
    }
   },
   {
    "box": {
     "id": "obj-s-lfo2RandPhase",
     "maxclass": "newobj",
     "patching_rect": [
      605.0,
      1200.0,
      80.0,
      22.0
     ],
     "numinlets": 1,
     "numoutlets": 1,
     "text": "prepend set",
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "obj-p-lfo2RandPhase",
     "maxclass": "newobj",
     "patching_rect": [
      605.0,
      1280.0,
      90.0,
      22.0
     ],
     "numinlets": 1,
     "numoutlets": 1,
     "text": "prepend p lfo2RandPhase",
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "obj-d-transpose",
     "maxclass": "live.dial",
     "patching_rect": [
      700.0,
      1226.0,
      44.0,
      48.0
     ],
     "numinlets": 1,
     "numoutlets": 2,
     "outlettype": [
      "",
      "float"
     ],
     "parameter_enable": 1,
     "varname": "tablas_transpose",
     "saved_attribute_attributes": {
      "valueof": {
       "parameter_longname": "Transpose",
       "parameter_shortname": "Transpose",
       "parameter_initial_enable": 1,
       "parameter_initial": [
        0
       ],
       "parameter_type": 1,
       "parameter_mmin": -48,
       "parameter_mmax": 48,
       "parameter_unitstyle": 0
      }
     }
    }
   },
   {
    "box": {
     "id": "obj-s-transpose",
     "maxclass": "newobj",
     "patching_rect": [
      700.0,
      1200.0,
      80.0,
      22.0
     ],
     "numinlets": 1,
     "numoutlets": 1,
     "text": "prepend set",
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "obj-p-transpose",
     "maxclass": "newobj",
     "patching_rect": [
      700.0,
      1280.0,
      90.0,
      22.0
     ],
     "numinlets": 1,
     "numoutlets": 1,
     "text": "prepend p transpose",
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "obj-d-pbRange",
     "maxclass": "live.dial",
     "patching_rect": [
      795.0,
      1226.0,
      44.0,
      48.0
     ],
     "numinlets": 1,
     "numoutlets": 2,
     "outlettype": [
      "",
      "float"
     ],
     "parameter_enable": 1,
     "varname": "tablas_pbRange",
     "saved_attribute_attributes": {
      "valueof": {
       "parameter_longname": "PB Range",
       "parameter_shortname": "PB Range",
       "parameter_initial_enable": 1,
       "parameter_initial": [
        2
       ],
       "parameter_type": 1,
       "parameter_mmin": 0,
       "parameter_mmax": 48,
       "parameter_unitstyle": 0
      }
     }
    }
   },
   {
    "box": {
     "id": "obj-s-pbRange",
     "maxclass": "newobj",
     "patching_rect": [
      795.0,
      1200.0,
      80.0,
      22.0
     ],
     "numinlets": 1,
     "numoutlets": 1,
     "text": "prepend set",
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "obj-p-pbRange",
     "maxclass": "newobj",
     "patching_rect": [
      795.0,
      1280.0,
      90.0,
      22.0
     ],
     "numinlets": 1,
     "numoutlets": 1,
     "text": "prepend p pbRange",
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "obj-d-mono",
     "maxclass": "live.dial",
     "patching_rect": [
      890.0,
      1226.0,
      44.0,
      48.0
     ],
     "numinlets": 1,
     "numoutlets": 2,
     "outlettype": [
      "",
      "float"
     ],
     "parameter_enable": 1,
     "varname": "tablas_mono",
     "saved_attribute_attributes": {
      "valueof": {
       "parameter_longname": "Mono",
       "parameter_shortname": "Mono",
       "parameter_initial_enable": 1,
       "parameter_initial": [
        0
       ],
       "parameter_type": 2,
       "parameter_enum": [
        "Off",
        "On"
       ],
       "parameter_mmax": 1
      }
     }
    }
   },
   {
    "box": {
     "id": "obj-s-mono",
     "maxclass": "newobj",
     "patching_rect": [
      890.0,
      1200.0,
      80.0,
      22.0
     ],
     "numinlets": 1,
     "numoutlets": 1,
     "text": "prepend set",
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "obj-p-mono",
     "maxclass": "newobj",
     "patching_rect": [
      890.0,
      1280.0,
      90.0,
      22.0
     ],
     "numinlets": 1,
     "numoutlets": 1,
     "text": "prepend p mono",
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "obj-d-glide",
     "maxclass": "live.dial",
     "patching_rect": [
      985.0,
      1226.0,
      44.0,
      48.0
     ],
     "numinlets": 1,
     "numoutlets": 2,
     "outlettype": [
      "",
      "float"
     ],
     "parameter_enable": 1,
     "varname": "tablas_glide",
     "saved_attribute_attributes": {
      "valueof": {
       "parameter_longname": "Glide",
       "parameter_shortname": "Glide",
       "parameter_initial_enable": 1,
       "parameter_initial": [
        0
       ],
       "parameter_type": 0,
       "parameter_mmin": 0.0,
       "parameter_mmax": 100.0,
       "parameter_unitstyle": 5
      }
     }
    }
   },
   {
    "box": {
     "id": "obj-s-glide",
     "maxclass": "newobj",
     "patching_rect": [
      985.0,
      1200.0,
      80.0,
      22.0
     ],
     "numinlets": 1,
     "numoutlets": 1,
     "text": "prepend set",
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "obj-p-glide",
     "maxclass": "newobj",
     "patching_rect": [
      985.0,
      1280.0,
      90.0,
      22.0
     ],
     "numinlets": 1,
     "numoutlets": 1,
     "text": "prepend p glide",
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "obj-d-bpm",
     "maxclass": "live.dial",
     "patching_rect": [
      320.0,
      1336.0,
      44.0,
      48.0
     ],
     "numinlets": 1,
     "numoutlets": 2,
     "outlettype": [
      "",
      "float"
     ],
     "parameter_enable": 1,
     "varname": "tablas_bpm",
     "saved_attribute_attributes": {
      "valueof": {
       "parameter_longname": "BPM",
       "parameter_shortname": "BPM",
       "parameter_initial_enable": 1,
       "parameter_initial": [
        120
       ],
       "parameter_type": 1,
       "parameter_mmin": 40,
       "parameter_mmax": 240,
       "parameter_unitstyle": 0
      }
     }
    }
   },
   {
    "box": {
     "id": "obj-s-bpm",
     "maxclass": "newobj",
     "patching_rect": [
      320.0,
      1310.0,
      80.0,
      22.0
     ],
     "numinlets": 1,
     "numoutlets": 1,
     "text": "prepend set",
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "obj-p-bpm",
     "maxclass": "newobj",
     "patching_rect": [
      320.0,
      1390.0,
      90.0,
      22.0
     ],
     "numinlets": 1,
     "numoutlets": 1,
     "text": "prepend p bpm",
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "obj-d-lfoModWheel",
     "maxclass": "live.dial",
     "patching_rect": [
      415.0,
      1336.0,
      44.0,
      48.0
     ],
     "numinlets": 1,
     "numoutlets": 2,
     "outlettype": [
      "",
      "float"
     ],
     "parameter_enable": 1,
     "varname": "tablas_lfoModWheel",
     "saved_attribute_attributes": {
      "valueof": {
       "parameter_longname": "L1 ModWheel",
       "parameter_shortname": "L1 ModWheel",
       "parameter_initial_enable": 1,
       "parameter_initial": [
        0
       ],
       "parameter_type": 2,
       "parameter_enum": [
        "Off",
        "On"
       ],
       "parameter_mmax": 1
      }
     }
    }
   },
   {
    "box": {
     "id": "obj-s-lfoModWheel",
     "maxclass": "newobj",
     "patching_rect": [
      415.0,
      1310.0,
      80.0,
      22.0
     ],
     "numinlets": 1,
     "numoutlets": 1,
     "text": "prepend set",
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "obj-p-lfoModWheel",
     "maxclass": "newobj",
     "patching_rect": [
      415.0,
      1390.0,
      90.0,
      22.0
     ],
     "numinlets": 1,
     "numoutlets": 1,
     "text": "prepend p lfoModWheel",
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "obj-d-lfo1Div",
     "maxclass": "live.dial",
     "patching_rect": [
      510.0,
      1336.0,
      44.0,
      48.0
     ],
     "numinlets": 1,
     "numoutlets": 2,
     "outlettype": [
      "",
      "float"
     ],
     "parameter_enable": 1,
     "varname": "tablas_lfo1Div",
     "saved_attribute_attributes": {
      "valueof": {
       "parameter_longname": "L1 Sync",
       "parameter_shortname": "L1 Sync",
       "parameter_initial_enable": 1,
       "parameter_initial": [
        2
       ],
       "parameter_type": 2,
       "parameter_enum": [
        "1/16",
        "1/8",
        "1/4",
        "1/2",
        "1 compás",
        "2 compases"
       ],
       "parameter_mmax": 5
      }
     }
    }
   },
   {
    "box": {
     "id": "obj-s-lfo1Div",
     "maxclass": "newobj",
     "patching_rect": [
      510.0,
      1310.0,
      80.0,
      22.0
     ],
     "numinlets": 1,
     "numoutlets": 1,
     "text": "prepend set",
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "obj-p-lfo1Div",
     "maxclass": "newobj",
     "patching_rect": [
      510.0,
      1390.0,
      90.0,
      22.0
     ],
     "numinlets": 1,
     "numoutlets": 1,
     "text": "prepend p lfo1Div",
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "obj-d-lfo1Audio",
     "maxclass": "live.dial",
     "patching_rect": [
      605.0,
      1336.0,
      44.0,
      48.0
     ],
     "numinlets": 1,
     "numoutlets": 2,
     "outlettype": [
      "",
      "float"
     ],
     "parameter_enable": 1,
     "varname": "tablas_lfo1Audio",
     "saved_attribute_attributes": {
      "valueof": {
       "parameter_longname": "L1 Audio Rate",
       "parameter_shortname": "L1 Audio Rate",
       "parameter_initial_enable": 1,
       "parameter_initial": [
        46.21
       ],
       "parameter_type": 0,
       "parameter_mmin": 0.0,
       "parameter_mmax": 100.0,
       "parameter_unitstyle": 5
      }
     }
    }
   },
   {
    "box": {
     "id": "obj-s-lfo1Audio",
     "maxclass": "newobj",
     "patching_rect": [
      605.0,
      1310.0,
      80.0,
      22.0
     ],
     "numinlets": 1,
     "numoutlets": 1,
     "text": "prepend set",
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "obj-p-lfo1Audio",
     "maxclass": "newobj",
     "patching_rect": [
      605.0,
      1390.0,
      90.0,
      22.0
     ],
     "numinlets": 1,
     "numoutlets": 1,
     "text": "prepend p lfo1Audio",
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "obj-d-lfo2Div",
     "maxclass": "live.dial",
     "patching_rect": [
      700.0,
      1336.0,
      44.0,
      48.0
     ],
     "numinlets": 1,
     "numoutlets": 2,
     "outlettype": [
      "",
      "float"
     ],
     "parameter_enable": 1,
     "varname": "tablas_lfo2Div",
     "saved_attribute_attributes": {
      "valueof": {
       "parameter_longname": "L2 Sync",
       "parameter_shortname": "L2 Sync",
       "parameter_initial_enable": 1,
       "parameter_initial": [
        2
       ],
       "parameter_type": 2,
       "parameter_enum": [
        "1/16",
        "1/8",
        "1/4",
        "1/2",
        "1 compás",
        "2 compases"
       ],
       "parameter_mmax": 5
      }
     }
    }
   },
   {
    "box": {
     "id": "obj-s-lfo2Div",
     "maxclass": "newobj",
     "patching_rect": [
      700.0,
      1310.0,
      80.0,
      22.0
     ],
     "numinlets": 1,
     "numoutlets": 1,
     "text": "prepend set",
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "obj-p-lfo2Div",
     "maxclass": "newobj",
     "patching_rect": [
      700.0,
      1390.0,
      90.0,
      22.0
     ],
     "numinlets": 1,
     "numoutlets": 1,
     "text": "prepend p lfo2Div",
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "obj-d-lfo2Audio",
     "maxclass": "live.dial",
     "patching_rect": [
      795.0,
      1336.0,
      44.0,
      48.0
     ],
     "numinlets": 1,
     "numoutlets": 2,
     "outlettype": [
      "",
      "float"
     ],
     "parameter_enable": 1,
     "varname": "tablas_lfo2Audio",
     "saved_attribute_attributes": {
      "valueof": {
       "parameter_longname": "L2 Audio Rate",
       "parameter_shortname": "L2 Audio Rate",
       "parameter_initial_enable": 1,
       "parameter_initial": [
        46.21
       ],
       "parameter_type": 0,
       "parameter_mmin": 0.0,
       "parameter_mmax": 100.0,
       "parameter_unitstyle": 5
      }
     }
    }
   },
   {
    "box": {
     "id": "obj-s-lfo2Audio",
     "maxclass": "newobj",
     "patching_rect": [
      795.0,
      1310.0,
      80.0,
      22.0
     ],
     "numinlets": 1,
     "numoutlets": 1,
     "text": "prepend set",
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "obj-p-lfo2Audio",
     "maxclass": "newobj",
     "patching_rect": [
      795.0,
      1390.0,
      90.0,
      22.0
     ],
     "numinlets": 1,
     "numoutlets": 1,
     "text": "prepend p lfo2Audio",
     "outlettype": [
      ""
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
   },
   {
    "patchline": {
     "source": [
      "obj-ui",
      2
     ],
     "destination": [
      "obj-route",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-route",
      0
     ],
     "destination": [
      "obj-rdy",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-rdy",
      0
     ],
     "destination": [
      "obj-synced",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-synced",
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
      "obj-route",
      1
     ],
     "destination": [
      "obj-s-o1Table",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-s-o1Table",
      0
     ],
     "destination": [
      "obj-d-o1Table",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-d-o1Table",
      0
     ],
     "destination": [
      "obj-p-o1Table",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-p-o1Table",
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
      "obj-rdy",
      1
     ],
     "destination": [
      "obj-d-o1Table",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-route",
      2
     ],
     "destination": [
      "obj-s-o1Pos",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-s-o1Pos",
      0
     ],
     "destination": [
      "obj-d-o1Pos",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-d-o1Pos",
      0
     ],
     "destination": [
      "obj-p-o1Pos",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-p-o1Pos",
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
      "obj-rdy",
      1
     ],
     "destination": [
      "obj-d-o1Pos",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-route",
      3
     ],
     "destination": [
      "obj-s-o1Fx",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-s-o1Fx",
      0
     ],
     "destination": [
      "obj-d-o1Fx",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-d-o1Fx",
      0
     ],
     "destination": [
      "obj-p-o1Fx",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-p-o1Fx",
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
      "obj-rdy",
      1
     ],
     "destination": [
      "obj-d-o1Fx",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-route",
      4
     ],
     "destination": [
      "obj-s-o1Fx1",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-s-o1Fx1",
      0
     ],
     "destination": [
      "obj-d-o1Fx1",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-d-o1Fx1",
      0
     ],
     "destination": [
      "obj-p-o1Fx1",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-p-o1Fx1",
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
      "obj-rdy",
      1
     ],
     "destination": [
      "obj-d-o1Fx1",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-route",
      5
     ],
     "destination": [
      "obj-s-o1Fx2",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-s-o1Fx2",
      0
     ],
     "destination": [
      "obj-d-o1Fx2",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-d-o1Fx2",
      0
     ],
     "destination": [
      "obj-p-o1Fx2",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-p-o1Fx2",
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
      "obj-rdy",
      1
     ],
     "destination": [
      "obj-d-o1Fx2",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-route",
      6
     ],
     "destination": [
      "obj-s-o1Semi",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-s-o1Semi",
      0
     ],
     "destination": [
      "obj-d-o1Semi",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-d-o1Semi",
      0
     ],
     "destination": [
      "obj-p-o1Semi",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-p-o1Semi",
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
      "obj-rdy",
      1
     ],
     "destination": [
      "obj-d-o1Semi",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-route",
      7
     ],
     "destination": [
      "obj-s-o1Fine",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-s-o1Fine",
      0
     ],
     "destination": [
      "obj-d-o1Fine",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-d-o1Fine",
      0
     ],
     "destination": [
      "obj-p-o1Fine",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-p-o1Fine",
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
      "obj-rdy",
      1
     ],
     "destination": [
      "obj-d-o1Fine",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-route",
      8
     ],
     "destination": [
      "obj-s-o1Level",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-s-o1Level",
      0
     ],
     "destination": [
      "obj-d-o1Level",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-d-o1Level",
      0
     ],
     "destination": [
      "obj-p-o1Level",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-p-o1Level",
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
      "obj-rdy",
      1
     ],
     "destination": [
      "obj-d-o1Level",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-route",
      9
     ],
     "destination": [
      "obj-s-o2Table",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-s-o2Table",
      0
     ],
     "destination": [
      "obj-d-o2Table",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-d-o2Table",
      0
     ],
     "destination": [
      "obj-p-o2Table",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-p-o2Table",
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
      "obj-rdy",
      1
     ],
     "destination": [
      "obj-d-o2Table",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-route",
      10
     ],
     "destination": [
      "obj-s-o2Pos",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-s-o2Pos",
      0
     ],
     "destination": [
      "obj-d-o2Pos",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-d-o2Pos",
      0
     ],
     "destination": [
      "obj-p-o2Pos",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-p-o2Pos",
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
      "obj-rdy",
      1
     ],
     "destination": [
      "obj-d-o2Pos",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-route",
      11
     ],
     "destination": [
      "obj-s-o2Fx",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-s-o2Fx",
      0
     ],
     "destination": [
      "obj-d-o2Fx",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-d-o2Fx",
      0
     ],
     "destination": [
      "obj-p-o2Fx",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-p-o2Fx",
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
      "obj-rdy",
      1
     ],
     "destination": [
      "obj-d-o2Fx",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-route",
      12
     ],
     "destination": [
      "obj-s-o2Fx1",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-s-o2Fx1",
      0
     ],
     "destination": [
      "obj-d-o2Fx1",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-d-o2Fx1",
      0
     ],
     "destination": [
      "obj-p-o2Fx1",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-p-o2Fx1",
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
      "obj-rdy",
      1
     ],
     "destination": [
      "obj-d-o2Fx1",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-route",
      13
     ],
     "destination": [
      "obj-s-o2Fx2",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-s-o2Fx2",
      0
     ],
     "destination": [
      "obj-d-o2Fx2",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-d-o2Fx2",
      0
     ],
     "destination": [
      "obj-p-o2Fx2",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-p-o2Fx2",
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
      "obj-rdy",
      1
     ],
     "destination": [
      "obj-d-o2Fx2",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-route",
      14
     ],
     "destination": [
      "obj-s-o2Semi",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-s-o2Semi",
      0
     ],
     "destination": [
      "obj-d-o2Semi",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-d-o2Semi",
      0
     ],
     "destination": [
      "obj-p-o2Semi",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-p-o2Semi",
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
      "obj-rdy",
      1
     ],
     "destination": [
      "obj-d-o2Semi",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-route",
      15
     ],
     "destination": [
      "obj-s-o2Fine",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-s-o2Fine",
      0
     ],
     "destination": [
      "obj-d-o2Fine",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-d-o2Fine",
      0
     ],
     "destination": [
      "obj-p-o2Fine",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-p-o2Fine",
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
      "obj-rdy",
      1
     ],
     "destination": [
      "obj-d-o2Fine",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-route",
      16
     ],
     "destination": [
      "obj-s-o2Level",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-s-o2Level",
      0
     ],
     "destination": [
      "obj-d-o2Level",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-d-o2Level",
      0
     ],
     "destination": [
      "obj-p-o2Level",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-p-o2Level",
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
      "obj-rdy",
      1
     ],
     "destination": [
      "obj-d-o2Level",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-route",
      17
     ],
     "destination": [
      "obj-s-subLevel",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-s-subLevel",
      0
     ],
     "destination": [
      "obj-d-subLevel",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-d-subLevel",
      0
     ],
     "destination": [
      "obj-p-subLevel",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-p-subLevel",
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
      "obj-rdy",
      1
     ],
     "destination": [
      "obj-d-subLevel",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-route",
      18
     ],
     "destination": [
      "obj-s-subOct",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-s-subOct",
      0
     ],
     "destination": [
      "obj-d-subOct",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-d-subOct",
      0
     ],
     "destination": [
      "obj-p-subOct",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-p-subOct",
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
      "obj-rdy",
      1
     ],
     "destination": [
      "obj-d-subOct",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-route",
      19
     ],
     "destination": [
      "obj-s-subTone",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-s-subTone",
      0
     ],
     "destination": [
      "obj-d-subTone",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-d-subTone",
      0
     ],
     "destination": [
      "obj-p-subTone",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-p-subTone",
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
      "obj-rdy",
      1
     ],
     "destination": [
      "obj-d-subTone",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-route",
      20
     ],
     "destination": [
      "obj-s-uniMode",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-s-uniMode",
      0
     ],
     "destination": [
      "obj-d-uniMode",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-d-uniMode",
      0
     ],
     "destination": [
      "obj-p-uniMode",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-p-uniMode",
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
      "obj-rdy",
      1
     ],
     "destination": [
      "obj-d-uniMode",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-route",
      21
     ],
     "destination": [
      "obj-s-uniVoices",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-s-uniVoices",
      0
     ],
     "destination": [
      "obj-d-uniVoices",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-d-uniVoices",
      0
     ],
     "destination": [
      "obj-p-uniVoices",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-p-uniVoices",
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
      "obj-rdy",
      1
     ],
     "destination": [
      "obj-d-uniVoices",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-route",
      22
     ],
     "destination": [
      "obj-s-uniAmt",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-s-uniAmt",
      0
     ],
     "destination": [
      "obj-d-uniAmt",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-d-uniAmt",
      0
     ],
     "destination": [
      "obj-p-uniAmt",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-p-uniAmt",
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
      "obj-rdy",
      1
     ],
     "destination": [
      "obj-d-uniAmt",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-route",
      23
     ],
     "destination": [
      "obj-s-oscSpread",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-s-oscSpread",
      0
     ],
     "destination": [
      "obj-d-oscSpread",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-d-oscSpread",
      0
     ],
     "destination": [
      "obj-p-oscSpread",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-p-oscSpread",
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
      "obj-rdy",
      1
     ],
     "destination": [
      "obj-d-oscSpread",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-route",
      24
     ],
     "destination": [
      "obj-s-volume",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-s-volume",
      0
     ],
     "destination": [
      "obj-d-volume",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-d-volume",
      0
     ],
     "destination": [
      "obj-p-volume",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-p-volume",
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
      "obj-rdy",
      1
     ],
     "destination": [
      "obj-d-volume",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-route",
      25
     ],
     "destination": [
      "obj-s-filterOn",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-s-filterOn",
      0
     ],
     "destination": [
      "obj-d-filterOn",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-d-filterOn",
      0
     ],
     "destination": [
      "obj-p-filterOn",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-p-filterOn",
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
      "obj-rdy",
      1
     ],
     "destination": [
      "obj-d-filterOn",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-route",
      26
     ],
     "destination": [
      "obj-s-filterMode",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-s-filterMode",
      0
     ],
     "destination": [
      "obj-d-filterMode",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-d-filterMode",
      0
     ],
     "destination": [
      "obj-p-filterMode",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-p-filterMode",
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
      "obj-rdy",
      1
     ],
     "destination": [
      "obj-d-filterMode",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-route",
      27
     ],
     "destination": [
      "obj-s-filterFreq",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-s-filterFreq",
      0
     ],
     "destination": [
      "obj-d-filterFreq",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-d-filterFreq",
      0
     ],
     "destination": [
      "obj-p-filterFreq",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-p-filterFreq",
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
      "obj-rdy",
      1
     ],
     "destination": [
      "obj-d-filterFreq",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-route",
      28
     ],
     "destination": [
      "obj-s-filterRes",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-s-filterRes",
      0
     ],
     "destination": [
      "obj-d-filterRes",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-d-filterRes",
      0
     ],
     "destination": [
      "obj-p-filterRes",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-p-filterRes",
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
      "obj-rdy",
      1
     ],
     "destination": [
      "obj-d-filterRes",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-route",
      29
     ],
     "destination": [
      "obj-s-filterWidth",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-s-filterWidth",
      0
     ],
     "destination": [
      "obj-d-filterWidth",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-d-filterWidth",
      0
     ],
     "destination": [
      "obj-p-filterWidth",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-p-filterWidth",
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
      "obj-rdy",
      1
     ],
     "destination": [
      "obj-d-filterWidth",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-route",
      30
     ],
     "destination": [
      "obj-s-e1A",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-s-e1A",
      0
     ],
     "destination": [
      "obj-d-e1A",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-d-e1A",
      0
     ],
     "destination": [
      "obj-p-e1A",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-p-e1A",
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
      "obj-rdy",
      1
     ],
     "destination": [
      "obj-d-e1A",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-route",
      31
     ],
     "destination": [
      "obj-s-e1D",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-s-e1D",
      0
     ],
     "destination": [
      "obj-d-e1D",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-d-e1D",
      0
     ],
     "destination": [
      "obj-p-e1D",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-p-e1D",
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
      "obj-rdy",
      1
     ],
     "destination": [
      "obj-d-e1D",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-route",
      32
     ],
     "destination": [
      "obj-s-e1S",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-s-e1S",
      0
     ],
     "destination": [
      "obj-d-e1S",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-d-e1S",
      0
     ],
     "destination": [
      "obj-p-e1S",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-p-e1S",
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
      "obj-rdy",
      1
     ],
     "destination": [
      "obj-d-e1S",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-route",
      33
     ],
     "destination": [
      "obj-s-e1R",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-s-e1R",
      0
     ],
     "destination": [
      "obj-d-e1R",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-d-e1R",
      0
     ],
     "destination": [
      "obj-p-e1R",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-p-e1R",
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
      "obj-rdy",
      1
     ],
     "destination": [
      "obj-d-e1R",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-route",
      34
     ],
     "destination": [
      "obj-s-e1Key",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-s-e1Key",
      0
     ],
     "destination": [
      "obj-d-e1Key",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-d-e1Key",
      0
     ],
     "destination": [
      "obj-p-e1Key",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-p-e1Key",
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
      "obj-rdy",
      1
     ],
     "destination": [
      "obj-d-e1Key",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-route",
      35
     ],
     "destination": [
      "obj-s-e2A",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-s-e2A",
      0
     ],
     "destination": [
      "obj-d-e2A",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-d-e2A",
      0
     ],
     "destination": [
      "obj-p-e2A",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-p-e2A",
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
      "obj-rdy",
      1
     ],
     "destination": [
      "obj-d-e2A",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-route",
      36
     ],
     "destination": [
      "obj-s-e2D",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-s-e2D",
      0
     ],
     "destination": [
      "obj-d-e2D",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-d-e2D",
      0
     ],
     "destination": [
      "obj-p-e2D",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-p-e2D",
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
      "obj-rdy",
      1
     ],
     "destination": [
      "obj-d-e2D",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-route",
      37
     ],
     "destination": [
      "obj-s-e2S",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-s-e2S",
      0
     ],
     "destination": [
      "obj-d-e2S",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-d-e2S",
      0
     ],
     "destination": [
      "obj-p-e2S",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-p-e2S",
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
      "obj-rdy",
      1
     ],
     "destination": [
      "obj-d-e2S",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-route",
      38
     ],
     "destination": [
      "obj-s-e2R",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-s-e2R",
      0
     ],
     "destination": [
      "obj-d-e2R",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-d-e2R",
      0
     ],
     "destination": [
      "obj-p-e2R",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-p-e2R",
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
      "obj-rdy",
      1
     ],
     "destination": [
      "obj-d-e2R",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-route",
      39
     ],
     "destination": [
      "obj-s-e2Key",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-s-e2Key",
      0
     ],
     "destination": [
      "obj-d-e2Key",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-d-e2Key",
      0
     ],
     "destination": [
      "obj-p-e2Key",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-p-e2Key",
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
      "obj-rdy",
      1
     ],
     "destination": [
      "obj-d-e2Key",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-route",
      40
     ],
     "destination": [
      "obj-s-e3A",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-s-e3A",
      0
     ],
     "destination": [
      "obj-d-e3A",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-d-e3A",
      0
     ],
     "destination": [
      "obj-p-e3A",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-p-e3A",
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
      "obj-rdy",
      1
     ],
     "destination": [
      "obj-d-e3A",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-route",
      41
     ],
     "destination": [
      "obj-s-e3D",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-s-e3D",
      0
     ],
     "destination": [
      "obj-d-e3D",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-d-e3D",
      0
     ],
     "destination": [
      "obj-p-e3D",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-p-e3D",
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
      "obj-rdy",
      1
     ],
     "destination": [
      "obj-d-e3D",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-route",
      42
     ],
     "destination": [
      "obj-s-e3S",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-s-e3S",
      0
     ],
     "destination": [
      "obj-d-e3S",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-d-e3S",
      0
     ],
     "destination": [
      "obj-p-e3S",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-p-e3S",
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
      "obj-rdy",
      1
     ],
     "destination": [
      "obj-d-e3S",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-route",
      43
     ],
     "destination": [
      "obj-s-e3R",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-s-e3R",
      0
     ],
     "destination": [
      "obj-d-e3R",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-d-e3R",
      0
     ],
     "destination": [
      "obj-p-e3R",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-p-e3R",
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
      "obj-rdy",
      1
     ],
     "destination": [
      "obj-d-e3R",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-route",
      44
     ],
     "destination": [
      "obj-s-e3Key",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-s-e3Key",
      0
     ],
     "destination": [
      "obj-d-e3Key",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-d-e3Key",
      0
     ],
     "destination": [
      "obj-p-e3Key",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-p-e3Key",
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
      "obj-rdy",
      1
     ],
     "destination": [
      "obj-d-e3Key",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-route",
      45
     ],
     "destination": [
      "obj-s-lfo1Mode",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-s-lfo1Mode",
      0
     ],
     "destination": [
      "obj-d-lfo1Mode",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-d-lfo1Mode",
      0
     ],
     "destination": [
      "obj-p-lfo1Mode",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-p-lfo1Mode",
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
      "obj-rdy",
      1
     ],
     "destination": [
      "obj-d-lfo1Mode",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-route",
      46
     ],
     "destination": [
      "obj-s-lfo1Rate",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-s-lfo1Rate",
      0
     ],
     "destination": [
      "obj-d-lfo1Rate",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-d-lfo1Rate",
      0
     ],
     "destination": [
      "obj-p-lfo1Rate",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-p-lfo1Rate",
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
      "obj-rdy",
      1
     ],
     "destination": [
      "obj-d-lfo1Rate",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-route",
      47
     ],
     "destination": [
      "obj-s-lfo1Shape",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-s-lfo1Shape",
      0
     ],
     "destination": [
      "obj-d-lfo1Shape",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-d-lfo1Shape",
      0
     ],
     "destination": [
      "obj-p-lfo1Shape",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-p-lfo1Shape",
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
      "obj-rdy",
      1
     ],
     "destination": [
      "obj-d-lfo1Shape",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-route",
      48
     ],
     "destination": [
      "obj-s-lfo1Amount",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-s-lfo1Amount",
      0
     ],
     "destination": [
      "obj-d-lfo1Amount",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-d-lfo1Amount",
      0
     ],
     "destination": [
      "obj-p-lfo1Amount",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-p-lfo1Amount",
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
      "obj-rdy",
      1
     ],
     "destination": [
      "obj-d-lfo1Amount",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-route",
      49
     ],
     "destination": [
      "obj-s-lfo1Stereo",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-s-lfo1Stereo",
      0
     ],
     "destination": [
      "obj-d-lfo1Stereo",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-d-lfo1Stereo",
      0
     ],
     "destination": [
      "obj-p-lfo1Stereo",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-p-lfo1Stereo",
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
      "obj-rdy",
      1
     ],
     "destination": [
      "obj-d-lfo1Stereo",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-route",
      50
     ],
     "destination": [
      "obj-s-lfo1Quant",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-s-lfo1Quant",
      0
     ],
     "destination": [
      "obj-d-lfo1Quant",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-d-lfo1Quant",
      0
     ],
     "destination": [
      "obj-p-lfo1Quant",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-p-lfo1Quant",
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
      "obj-rdy",
      1
     ],
     "destination": [
      "obj-d-lfo1Quant",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-route",
      51
     ],
     "destination": [
      "obj-s-lfo1Phase",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-s-lfo1Phase",
      0
     ],
     "destination": [
      "obj-d-lfo1Phase",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-d-lfo1Phase",
      0
     ],
     "destination": [
      "obj-p-lfo1Phase",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-p-lfo1Phase",
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
      "obj-rdy",
      1
     ],
     "destination": [
      "obj-d-lfo1Phase",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-route",
      52
     ],
     "destination": [
      "obj-s-lfo1RandPhase",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-s-lfo1RandPhase",
      0
     ],
     "destination": [
      "obj-d-lfo1RandPhase",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-d-lfo1RandPhase",
      0
     ],
     "destination": [
      "obj-p-lfo1RandPhase",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-p-lfo1RandPhase",
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
      "obj-rdy",
      1
     ],
     "destination": [
      "obj-d-lfo1RandPhase",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-route",
      53
     ],
     "destination": [
      "obj-s-lfo2Mode",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-s-lfo2Mode",
      0
     ],
     "destination": [
      "obj-d-lfo2Mode",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-d-lfo2Mode",
      0
     ],
     "destination": [
      "obj-p-lfo2Mode",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-p-lfo2Mode",
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
      "obj-rdy",
      1
     ],
     "destination": [
      "obj-d-lfo2Mode",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-route",
      54
     ],
     "destination": [
      "obj-s-lfo2Rate",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-s-lfo2Rate",
      0
     ],
     "destination": [
      "obj-d-lfo2Rate",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-d-lfo2Rate",
      0
     ],
     "destination": [
      "obj-p-lfo2Rate",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-p-lfo2Rate",
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
      "obj-rdy",
      1
     ],
     "destination": [
      "obj-d-lfo2Rate",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-route",
      55
     ],
     "destination": [
      "obj-s-lfo2Shape",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-s-lfo2Shape",
      0
     ],
     "destination": [
      "obj-d-lfo2Shape",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-d-lfo2Shape",
      0
     ],
     "destination": [
      "obj-p-lfo2Shape",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-p-lfo2Shape",
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
      "obj-rdy",
      1
     ],
     "destination": [
      "obj-d-lfo2Shape",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-route",
      56
     ],
     "destination": [
      "obj-s-lfo2Amount",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-s-lfo2Amount",
      0
     ],
     "destination": [
      "obj-d-lfo2Amount",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-d-lfo2Amount",
      0
     ],
     "destination": [
      "obj-p-lfo2Amount",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-p-lfo2Amount",
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
      "obj-rdy",
      1
     ],
     "destination": [
      "obj-d-lfo2Amount",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-route",
      57
     ],
     "destination": [
      "obj-s-lfo2Stereo",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-s-lfo2Stereo",
      0
     ],
     "destination": [
      "obj-d-lfo2Stereo",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-d-lfo2Stereo",
      0
     ],
     "destination": [
      "obj-p-lfo2Stereo",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-p-lfo2Stereo",
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
      "obj-rdy",
      1
     ],
     "destination": [
      "obj-d-lfo2Stereo",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-route",
      58
     ],
     "destination": [
      "obj-s-lfo2Quant",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-s-lfo2Quant",
      0
     ],
     "destination": [
      "obj-d-lfo2Quant",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-d-lfo2Quant",
      0
     ],
     "destination": [
      "obj-p-lfo2Quant",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-p-lfo2Quant",
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
      "obj-rdy",
      1
     ],
     "destination": [
      "obj-d-lfo2Quant",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-route",
      59
     ],
     "destination": [
      "obj-s-lfo2Phase",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-s-lfo2Phase",
      0
     ],
     "destination": [
      "obj-d-lfo2Phase",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-d-lfo2Phase",
      0
     ],
     "destination": [
      "obj-p-lfo2Phase",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-p-lfo2Phase",
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
      "obj-rdy",
      1
     ],
     "destination": [
      "obj-d-lfo2Phase",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-route",
      60
     ],
     "destination": [
      "obj-s-lfo2RandPhase",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-s-lfo2RandPhase",
      0
     ],
     "destination": [
      "obj-d-lfo2RandPhase",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-d-lfo2RandPhase",
      0
     ],
     "destination": [
      "obj-p-lfo2RandPhase",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-p-lfo2RandPhase",
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
      "obj-rdy",
      1
     ],
     "destination": [
      "obj-d-lfo2RandPhase",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-route",
      61
     ],
     "destination": [
      "obj-s-transpose",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-s-transpose",
      0
     ],
     "destination": [
      "obj-d-transpose",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-d-transpose",
      0
     ],
     "destination": [
      "obj-p-transpose",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-p-transpose",
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
      "obj-rdy",
      1
     ],
     "destination": [
      "obj-d-transpose",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-route",
      62
     ],
     "destination": [
      "obj-s-pbRange",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-s-pbRange",
      0
     ],
     "destination": [
      "obj-d-pbRange",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-d-pbRange",
      0
     ],
     "destination": [
      "obj-p-pbRange",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-p-pbRange",
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
      "obj-rdy",
      1
     ],
     "destination": [
      "obj-d-pbRange",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-route",
      63
     ],
     "destination": [
      "obj-s-mono",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-s-mono",
      0
     ],
     "destination": [
      "obj-d-mono",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-d-mono",
      0
     ],
     "destination": [
      "obj-p-mono",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-p-mono",
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
      "obj-rdy",
      1
     ],
     "destination": [
      "obj-d-mono",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-route",
      64
     ],
     "destination": [
      "obj-s-glide",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-s-glide",
      0
     ],
     "destination": [
      "obj-d-glide",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-d-glide",
      0
     ],
     "destination": [
      "obj-p-glide",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-p-glide",
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
      "obj-rdy",
      1
     ],
     "destination": [
      "obj-d-glide",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-route",
      65
     ],
     "destination": [
      "obj-s-bpm",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-s-bpm",
      0
     ],
     "destination": [
      "obj-d-bpm",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-d-bpm",
      0
     ],
     "destination": [
      "obj-p-bpm",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-p-bpm",
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
      "obj-rdy",
      1
     ],
     "destination": [
      "obj-d-bpm",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-route",
      66
     ],
     "destination": [
      "obj-s-lfoModWheel",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-s-lfoModWheel",
      0
     ],
     "destination": [
      "obj-d-lfoModWheel",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-d-lfoModWheel",
      0
     ],
     "destination": [
      "obj-p-lfoModWheel",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-p-lfoModWheel",
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
      "obj-rdy",
      1
     ],
     "destination": [
      "obj-d-lfoModWheel",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-route",
      67
     ],
     "destination": [
      "obj-s-lfo1Div",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-s-lfo1Div",
      0
     ],
     "destination": [
      "obj-d-lfo1Div",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-d-lfo1Div",
      0
     ],
     "destination": [
      "obj-p-lfo1Div",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-p-lfo1Div",
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
      "obj-rdy",
      1
     ],
     "destination": [
      "obj-d-lfo1Div",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-route",
      68
     ],
     "destination": [
      "obj-s-lfo1Audio",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-s-lfo1Audio",
      0
     ],
     "destination": [
      "obj-d-lfo1Audio",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-d-lfo1Audio",
      0
     ],
     "destination": [
      "obj-p-lfo1Audio",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-p-lfo1Audio",
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
      "obj-rdy",
      1
     ],
     "destination": [
      "obj-d-lfo1Audio",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-route",
      69
     ],
     "destination": [
      "obj-s-lfo2Div",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-s-lfo2Div",
      0
     ],
     "destination": [
      "obj-d-lfo2Div",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-d-lfo2Div",
      0
     ],
     "destination": [
      "obj-p-lfo2Div",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-p-lfo2Div",
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
      "obj-rdy",
      1
     ],
     "destination": [
      "obj-d-lfo2Div",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-route",
      70
     ],
     "destination": [
      "obj-s-lfo2Audio",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-s-lfo2Audio",
      0
     ],
     "destination": [
      "obj-d-lfo2Audio",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-d-lfo2Audio",
      0
     ],
     "destination": [
      "obj-p-lfo2Audio",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-p-lfo2Audio",
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
      "obj-rdy",
      1
     ],
     "destination": [
      "obj-d-lfo2Audio",
      0
     ]
    }
   }
  ],
  "parameters": {
   "obj-d-o1Table": [
    "O1 Table",
    "O1 Table",
    0
   ],
   "obj-d-o1Pos": [
    "O1 Position",
    "O1 Position",
    0
   ],
   "obj-d-o1Fx": [
    "O1 FX Type",
    "O1 FX Type",
    0
   ],
   "obj-d-o1Fx1": [
    "O1 FX 1",
    "O1 FX 1",
    0
   ],
   "obj-d-o1Fx2": [
    "O1 FX 2",
    "O1 FX 2",
    0
   ],
   "obj-d-o1Semi": [
    "O1 Semi",
    "O1 Semi",
    0
   ],
   "obj-d-o1Fine": [
    "O1 Fine",
    "O1 Fine",
    0
   ],
   "obj-d-o1Level": [
    "O1 Level",
    "O1 Level",
    0
   ],
   "obj-d-o2Table": [
    "O2 Table",
    "O2 Table",
    0
   ],
   "obj-d-o2Pos": [
    "O2 Position",
    "O2 Position",
    0
   ],
   "obj-d-o2Fx": [
    "O2 FX Type",
    "O2 FX Type",
    0
   ],
   "obj-d-o2Fx1": [
    "O2 FX 1",
    "O2 FX 1",
    0
   ],
   "obj-d-o2Fx2": [
    "O2 FX 2",
    "O2 FX 2",
    0
   ],
   "obj-d-o2Semi": [
    "O2 Semi",
    "O2 Semi",
    0
   ],
   "obj-d-o2Fine": [
    "O2 Fine",
    "O2 Fine",
    0
   ],
   "obj-d-o2Level": [
    "O2 Level",
    "O2 Level",
    0
   ],
   "obj-d-subLevel": [
    "Sub Level",
    "Sub Level",
    0
   ],
   "obj-d-subOct": [
    "Sub Octave",
    "Sub Octave",
    0
   ],
   "obj-d-subTone": [
    "Sub Tone",
    "Sub Tone",
    0
   ],
   "obj-d-uniMode": [
    "Unison Mode",
    "Unison Mode",
    0
   ],
   "obj-d-uniVoices": [
    "Unison Voices",
    "Unison Voices",
    0
   ],
   "obj-d-uniAmt": [
    "Unison Amount",
    "Unison Amount",
    0
   ],
   "obj-d-oscSpread": [
    "Osc Stereo",
    "Osc Stereo",
    0
   ],
   "obj-d-volume": [
    "Volume",
    "Volume",
    0
   ],
   "obj-d-filterOn": [
    "Filter On",
    "Filter On",
    0
   ],
   "obj-d-filterMode": [
    "Filter Type",
    "Filter Type",
    0
   ],
   "obj-d-filterFreq": [
    "Filter Freq",
    "Filter Freq",
    0
   ],
   "obj-d-filterRes": [
    "Filter Reso",
    "Filter Reso",
    0
   ],
   "obj-d-filterWidth": [
    "Filter Width",
    "Filter Width",
    0
   ],
   "obj-d-e1A": [
    "E1 Attack",
    "E1 Attack",
    0
   ],
   "obj-d-e1D": [
    "E1 Decay",
    "E1 Decay",
    0
   ],
   "obj-d-e1S": [
    "E1 Sustain",
    "E1 Sustain",
    0
   ],
   "obj-d-e1R": [
    "E1 Release",
    "E1 Release",
    0
   ],
   "obj-d-e1Key": [
    "E1 Key",
    "E1 Key",
    0
   ],
   "obj-d-e2A": [
    "E2 Attack",
    "E2 Attack",
    0
   ],
   "obj-d-e2D": [
    "E2 Decay",
    "E2 Decay",
    0
   ],
   "obj-d-e2S": [
    "E2 Sustain",
    "E2 Sustain",
    0
   ],
   "obj-d-e2R": [
    "E2 Release",
    "E2 Release",
    0
   ],
   "obj-d-e2Key": [
    "E2 Key",
    "E2 Key",
    0
   ],
   "obj-d-e3A": [
    "E3 Attack",
    "E3 Attack",
    0
   ],
   "obj-d-e3D": [
    "E3 Decay",
    "E3 Decay",
    0
   ],
   "obj-d-e3S": [
    "E3 Sustain",
    "E3 Sustain",
    0
   ],
   "obj-d-e3R": [
    "E3 Release",
    "E3 Release",
    0
   ],
   "obj-d-e3Key": [
    "E3 Key",
    "E3 Key",
    0
   ],
   "obj-d-lfo1Mode": [
    "L1 Mode",
    "L1 Mode",
    0
   ],
   "obj-d-lfo1Rate": [
    "L1 Rate",
    "L1 Rate",
    0
   ],
   "obj-d-lfo1Shape": [
    "L1 Shape",
    "L1 Shape",
    0
   ],
   "obj-d-lfo1Amount": [
    "L1 Amount",
    "L1 Amount",
    0
   ],
   "obj-d-lfo1Stereo": [
    "L1 Stereo",
    "L1 Stereo",
    0
   ],
   "obj-d-lfo1Quant": [
    "L1 Quant",
    "L1 Quant",
    0
   ],
   "obj-d-lfo1Phase": [
    "L1 Phase",
    "L1 Phase",
    0
   ],
   "obj-d-lfo1RandPhase": [
    "L1 Rnd Phase",
    "L1 Rnd Phase",
    0
   ],
   "obj-d-lfo2Mode": [
    "L2 Mode",
    "L2 Mode",
    0
   ],
   "obj-d-lfo2Rate": [
    "L2 Rate",
    "L2 Rate",
    0
   ],
   "obj-d-lfo2Shape": [
    "L2 Shape",
    "L2 Shape",
    0
   ],
   "obj-d-lfo2Amount": [
    "L2 Amount",
    "L2 Amount",
    0
   ],
   "obj-d-lfo2Stereo": [
    "L2 Stereo",
    "L2 Stereo",
    0
   ],
   "obj-d-lfo2Quant": [
    "L2 Quant",
    "L2 Quant",
    0
   ],
   "obj-d-lfo2Phase": [
    "L2 Phase",
    "L2 Phase",
    0
   ],
   "obj-d-lfo2RandPhase": [
    "L2 Rnd Phase",
    "L2 Rnd Phase",
    0
   ],
   "obj-d-transpose": [
    "Transpose",
    "Transpose",
    0
   ],
   "obj-d-pbRange": [
    "PB Range",
    "PB Range",
    0
   ],
   "obj-d-mono": [
    "Mono",
    "Mono",
    0
   ],
   "obj-d-glide": [
    "Glide",
    "Glide",
    0
   ],
   "obj-d-bpm": [
    "BPM",
    "BPM",
    0
   ],
   "obj-d-lfoModWheel": [
    "L1 ModWheel",
    "L1 ModWheel",
    0
   ],
   "obj-d-lfo1Div": [
    "L1 Sync",
    "L1 Sync",
    0
   ],
   "obj-d-lfo1Audio": [
    "L1 Audio Rate",
    "L1 Audio Rate",
    0
   ],
   "obj-d-lfo2Div": [
    "L2 Sync",
    "L2 Sync",
    0
   ],
   "obj-d-lfo2Audio": [
    "L2 Audio Rate",
    "L2 Audio Rate",
    0
   ],
   "parameterbanks": {
    "0": {
     "index": 0,
     "name": "Osc 1",
     "parameters": [
      "O1 Table",
      "O1 Position",
      "O1 FX Type",
      "O1 FX 1",
      "O1 FX 2",
      "O1 Semi",
      "O1 Fine",
      "O1 Level"
     ]
    },
    "1": {
     "index": 1,
     "name": "Osc 2",
     "parameters": [
      "O2 Table",
      "O2 Position",
      "O2 FX Type",
      "O2 FX 1",
      "O2 FX 2",
      "O2 Semi",
      "O2 Fine",
      "O2 Level"
     ]
    },
    "2": {
     "index": 2,
     "name": "Mezcla",
     "parameters": [
      "Sub Level",
      "Sub Octave",
      "Sub Tone",
      "Unison Mode",
      "Unison Voices",
      "Unison Amount",
      "Osc Stereo",
      "Volume"
     ]
    },
    "3": {
     "index": 3,
     "name": "Filtro",
     "parameters": [
      "Filter On",
      "Filter Type",
      "Filter Freq",
      "Filter Reso",
      "Filter Width",
      "-",
      "-",
      "-"
     ]
    },
    "4": {
     "index": 4,
     "name": "Env 1",
     "parameters": [
      "E1 Attack",
      "E1 Decay",
      "E1 Sustain",
      "E1 Release",
      "E1 Key",
      "-",
      "-",
      "-"
     ]
    },
    "5": {
     "index": 5,
     "name": "Env 2",
     "parameters": [
      "E2 Attack",
      "E2 Decay",
      "E2 Sustain",
      "E2 Release",
      "E2 Key",
      "-",
      "-",
      "-"
     ]
    },
    "6": {
     "index": 6,
     "name": "Env 3",
     "parameters": [
      "E3 Attack",
      "E3 Decay",
      "E3 Sustain",
      "E3 Release",
      "E3 Key",
      "-",
      "-",
      "-"
     ]
    },
    "7": {
     "index": 7,
     "name": "LFO 1",
     "parameters": [
      "L1 Mode",
      "L1 Rate",
      "L1 Shape",
      "L1 Amount",
      "L1 Stereo",
      "L1 Quant",
      "L1 Phase",
      "L1 Rnd Phase"
     ]
    },
    "8": {
     "index": 8,
     "name": "LFO 2",
     "parameters": [
      "L2 Mode",
      "L2 Rate",
      "L2 Shape",
      "L2 Amount",
      "L2 Stereo",
      "L2 Quant",
      "L2 Phase",
      "L2 Rnd Phase"
     ]
    },
    "9": {
     "index": 9,
     "name": "Nota",
     "parameters": [
      "Transpose",
      "PB Range",
      "Mono",
      "Glide",
      "BPM",
      "L1 ModWheel",
      "-",
      "-"
     ]
    },
    "10": {
     "index": 10,
     "name": "LFO Sync",
     "parameters": [
      "L1 Sync",
      "L1 Audio Rate",
      "L2 Sync",
      "L2 Audio Rate",
      "-",
      "-",
      "-",
      "-"
     ]
    }
   },
   "inherited_shortname": 1
  },
  "openrect": [
   0.0,
   0.0,
   200.0,
   169.0
  ],
  "title": "Tablas",
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