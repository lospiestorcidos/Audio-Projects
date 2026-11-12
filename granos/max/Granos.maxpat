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
     "numoutlets": 3,
     "text": "p Granos",
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
         "url": "https://lospiestorcidos.github.io/Audio-Projects/?ui=pages&host=max",
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
     "numoutlets": 50,
     "text": "route ready mode position size shape reverse density spread volume transpose tune pbRange mono glide scanSpeed scanDist scanLoop variation varPos varSize varPitch varVol filterOn filterMode filterFreq filterRes filterWidth e1A e1D e1S e1R e1Key e2A e2D e2S e2R e2Key lfoMode lfoRate lfoShape lfoAmount lfoStereo lfoQuant lfoPhase lfoRandPhase bpm lfoModWheel lfoDiv lfoAudio",
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
     "id": "obj-d-mode",
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
     "varname": "granos_mode",
     "saved_attribute_attributes": {
      "valueof": {
       "parameter_longname": "Modo",
       "parameter_shortname": "Modo",
       "parameter_initial_enable": 1,
       "parameter_initial": [
        0
       ],
       "parameter_type": 2,
       "parameter_enum": [
        "Classic",
        "Loop",
        "Cloud"
       ],
       "parameter_mmax": 2
      }
     }
    }
   },
   {
    "box": {
     "id": "obj-s-mode",
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
     "id": "obj-p-mode",
     "maxclass": "newobj",
     "patching_rect": [
      320.0,
      510.0,
      90.0,
      22.0
     ],
     "numinlets": 1,
     "numoutlets": 1,
     "text": "prepend p mode",
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "obj-d-position",
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
     "varname": "granos_position",
     "saved_attribute_attributes": {
      "valueof": {
       "parameter_longname": "Position",
       "parameter_shortname": "Position",
       "parameter_initial_enable": 1,
       "parameter_initial": [
        25
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
     "id": "obj-s-position",
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
     "id": "obj-p-position",
     "maxclass": "newobj",
     "patching_rect": [
      415.0,
      510.0,
      90.0,
      22.0
     ],
     "numinlets": 1,
     "numoutlets": 1,
     "text": "prepend p position",
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "obj-d-size",
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
     "varname": "granos_size",
     "saved_attribute_attributes": {
      "valueof": {
       "parameter_longname": "Grain Size",
       "parameter_shortname": "Grain Size",
       "parameter_initial_enable": 1,
       "parameter_initial": [
        59.27
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
     "id": "obj-s-size",
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
     "id": "obj-p-size",
     "maxclass": "newobj",
     "patching_rect": [
      510.0,
      510.0,
      90.0,
      22.0
     ],
     "numinlets": 1,
     "numoutlets": 1,
     "text": "prepend p size",
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "obj-d-shape",
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
     "varname": "granos_shape",
     "saved_attribute_attributes": {
      "valueof": {
       "parameter_longname": "Shape",
       "parameter_shortname": "Shape",
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
     "id": "obj-s-shape",
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
     "id": "obj-p-shape",
     "maxclass": "newobj",
     "patching_rect": [
      605.0,
      510.0,
      90.0,
      22.0
     ],
     "numinlets": 1,
     "numoutlets": 1,
     "text": "prepend p shape",
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "obj-d-reverse",
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
     "varname": "granos_reverse",
     "saved_attribute_attributes": {
      "valueof": {
       "parameter_longname": "Reverse",
       "parameter_shortname": "Reverse",
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
     "id": "obj-s-reverse",
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
     "id": "obj-p-reverse",
     "maxclass": "newobj",
     "patching_rect": [
      700.0,
      510.0,
      90.0,
      22.0
     ],
     "numinlets": 1,
     "numoutlets": 1,
     "text": "prepend p reverse",
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "obj-d-density",
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
     "varname": "granos_density",
     "saved_attribute_attributes": {
      "valueof": {
       "parameter_longname": "Density",
       "parameter_shortname": "Density",
       "parameter_initial_enable": 1,
       "parameter_initial": [
        36.84
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
     "id": "obj-s-density",
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
     "id": "obj-p-density",
     "maxclass": "newobj",
     "patching_rect": [
      795.0,
      510.0,
      90.0,
      22.0
     ],
     "numinlets": 1,
     "numoutlets": 1,
     "text": "prepend p density",
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "obj-d-spread",
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
     "varname": "granos_spread",
     "saved_attribute_attributes": {
      "valueof": {
       "parameter_longname": "Spread",
       "parameter_shortname": "Spread",
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
     "id": "obj-s-spread",
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
     "id": "obj-p-spread",
     "maxclass": "newobj",
     "patching_rect": [
      890.0,
      510.0,
      90.0,
      22.0
     ],
     "numinlets": 1,
     "numoutlets": 1,
     "text": "prepend p spread",
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
     "varname": "granos_volume",
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
     "id": "obj-p-volume",
     "maxclass": "newobj",
     "patching_rect": [
      985.0,
      510.0,
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
     "id": "obj-d-transpose",
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
     "varname": "granos_transpose",
     "saved_attribute_attributes": {
      "valueof": {
       "parameter_longname": "Transpose",
       "parameter_shortname": "Transpose",
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
     "id": "obj-s-transpose",
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
     "id": "obj-p-transpose",
     "maxclass": "newobj",
     "patching_rect": [
      320.0,
      620.0,
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
     "id": "obj-d-tune",
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
     "varname": "granos_tune",
     "saved_attribute_attributes": {
      "valueof": {
       "parameter_longname": "Tune",
       "parameter_shortname": "Tune",
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
     "id": "obj-s-tune",
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
     "id": "obj-p-tune",
     "maxclass": "newobj",
     "patching_rect": [
      415.0,
      620.0,
      90.0,
      22.0
     ],
     "numinlets": 1,
     "numoutlets": 1,
     "text": "prepend p tune",
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
     "varname": "granos_pbRange",
     "saved_attribute_attributes": {
      "valueof": {
       "parameter_longname": "PB Range",
       "parameter_shortname": "PB Range",
       "parameter_initial_enable": 1,
       "parameter_initial": [
        4.17
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
     "id": "obj-s-pbRange",
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
     "id": "obj-p-pbRange",
     "maxclass": "newobj",
     "patching_rect": [
      510.0,
      620.0,
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
     "varname": "granos_mono",
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
     "id": "obj-p-mono",
     "maxclass": "newobj",
     "patching_rect": [
      605.0,
      620.0,
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
     "varname": "granos_glide",
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
     "id": "obj-p-glide",
     "maxclass": "newobj",
     "patching_rect": [
      700.0,
      620.0,
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
     "id": "obj-d-scanSpeed",
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
     "varname": "granos_scanSpeed",
     "saved_attribute_attributes": {
      "valueof": {
       "parameter_longname": "Scan Speed",
       "parameter_shortname": "Scan Speed",
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
     "id": "obj-s-scanSpeed",
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
     "id": "obj-p-scanSpeed",
     "maxclass": "newobj",
     "patching_rect": [
      795.0,
      620.0,
      90.0,
      22.0
     ],
     "numinlets": 1,
     "numoutlets": 1,
     "text": "prepend p scanSpeed",
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "obj-d-scanDist",
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
     "varname": "granos_scanDist",
     "saved_attribute_attributes": {
      "valueof": {
       "parameter_longname": "Scan Dist",
       "parameter_shortname": "Scan Dist",
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
     "id": "obj-s-scanDist",
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
     "id": "obj-p-scanDist",
     "maxclass": "newobj",
     "patching_rect": [
      890.0,
      620.0,
      90.0,
      22.0
     ],
     "numinlets": 1,
     "numoutlets": 1,
     "text": "prepend p scanDist",
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "obj-d-scanLoop",
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
     "varname": "granos_scanLoop",
     "saved_attribute_attributes": {
      "valueof": {
       "parameter_longname": "Scan Loop",
       "parameter_shortname": "Scan Loop",
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
     "id": "obj-s-scanLoop",
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
     "id": "obj-p-scanLoop",
     "maxclass": "newobj",
     "patching_rect": [
      985.0,
      620.0,
      90.0,
      22.0
     ],
     "numinlets": 1,
     "numoutlets": 1,
     "text": "prepend p scanLoop",
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "obj-d-variation",
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
     "varname": "granos_variation",
     "saved_attribute_attributes": {
      "valueof": {
       "parameter_longname": "Var Amount",
       "parameter_shortname": "Var Amount",
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
     "id": "obj-s-variation",
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
     "id": "obj-p-variation",
     "maxclass": "newobj",
     "patching_rect": [
      320.0,
      730.0,
      90.0,
      22.0
     ],
     "numinlets": 1,
     "numoutlets": 1,
     "text": "prepend p variation",
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "obj-d-varPos",
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
     "varname": "granos_varPos",
     "saved_attribute_attributes": {
      "valueof": {
       "parameter_longname": "Var Position",
       "parameter_shortname": "Var Position",
       "parameter_initial_enable": 1,
       "parameter_initial": [
        5
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
     "id": "obj-s-varPos",
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
     "id": "obj-p-varPos",
     "maxclass": "newobj",
     "patching_rect": [
      415.0,
      730.0,
      90.0,
      22.0
     ],
     "numinlets": 1,
     "numoutlets": 1,
     "text": "prepend p varPos",
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "obj-d-varSize",
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
     "varname": "granos_varSize",
     "saved_attribute_attributes": {
      "valueof": {
       "parameter_longname": "Var Size",
       "parameter_shortname": "Var Size",
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
     "id": "obj-s-varSize",
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
     "id": "obj-p-varSize",
     "maxclass": "newobj",
     "patching_rect": [
      510.0,
      730.0,
      90.0,
      22.0
     ],
     "numinlets": 1,
     "numoutlets": 1,
     "text": "prepend p varSize",
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "obj-d-varPitch",
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
     "varname": "granos_varPitch",
     "saved_attribute_attributes": {
      "valueof": {
       "parameter_longname": "Var Transp",
       "parameter_shortname": "Var Transp",
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
     "id": "obj-s-varPitch",
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
     "id": "obj-p-varPitch",
     "maxclass": "newobj",
     "patching_rect": [
      605.0,
      730.0,
      90.0,
      22.0
     ],
     "numinlets": 1,
     "numoutlets": 1,
     "text": "prepend p varPitch",
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "obj-d-varVol",
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
     "varname": "granos_varVol",
     "saved_attribute_attributes": {
      "valueof": {
       "parameter_longname": "Var Volume",
       "parameter_shortname": "Var Volume",
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
     "id": "obj-s-varVol",
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
     "id": "obj-p-varVol",
     "maxclass": "newobj",
     "patching_rect": [
      700.0,
      730.0,
      90.0,
      22.0
     ],
     "numinlets": 1,
     "numoutlets": 1,
     "text": "prepend p varVol",
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
     "varname": "granos_filterOn",
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
     "id": "obj-p-filterOn",
     "maxclass": "newobj",
     "patching_rect": [
      795.0,
      730.0,
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
     "varname": "granos_filterMode",
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
     "id": "obj-p-filterMode",
     "maxclass": "newobj",
     "patching_rect": [
      890.0,
      730.0,
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
     "varname": "granos_filterFreq",
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
     "id": "obj-p-filterFreq",
     "maxclass": "newobj",
     "patching_rect": [
      985.0,
      730.0,
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
     "varname": "granos_filterRes",
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
     "id": "obj-p-filterRes",
     "maxclass": "newobj",
     "patching_rect": [
      320.0,
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
     "varname": "granos_filterWidth",
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
     "id": "obj-p-filterWidth",
     "maxclass": "newobj",
     "patching_rect": [
      415.0,
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
     "varname": "granos_e1A",
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
     "id": "obj-p-e1A",
     "maxclass": "newobj",
     "patching_rect": [
      510.0,
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
     "varname": "granos_e1D",
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
     "id": "obj-p-e1D",
     "maxclass": "newobj",
     "patching_rect": [
      605.0,
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
     "varname": "granos_e1S",
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
     "id": "obj-p-e1S",
     "maxclass": "newobj",
     "patching_rect": [
      700.0,
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
     "varname": "granos_e1R",
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
     "id": "obj-p-e1R",
     "maxclass": "newobj",
     "patching_rect": [
      795.0,
      840.0,
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
     "varname": "granos_e1Key",
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
     "id": "obj-p-e1Key",
     "maxclass": "newobj",
     "patching_rect": [
      890.0,
      840.0,
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
     "varname": "granos_e2A",
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
     "id": "obj-p-e2A",
     "maxclass": "newobj",
     "patching_rect": [
      985.0,
      840.0,
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
     "varname": "granos_e2D",
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
     "id": "obj-p-e2D",
     "maxclass": "newobj",
     "patching_rect": [
      320.0,
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
     "varname": "granos_e2S",
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
     "id": "obj-p-e2S",
     "maxclass": "newobj",
     "patching_rect": [
      415.0,
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
     "varname": "granos_e2R",
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
     "id": "obj-p-e2R",
     "maxclass": "newobj",
     "patching_rect": [
      510.0,
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
     "varname": "granos_e2Key",
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
     "id": "obj-p-e2Key",
     "maxclass": "newobj",
     "patching_rect": [
      605.0,
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
     "id": "obj-d-lfoMode",
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
     "varname": "granos_lfoMode",
     "saved_attribute_attributes": {
      "valueof": {
       "parameter_longname": "LFO Mode",
       "parameter_shortname": "LFO Mode",
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
     "id": "obj-s-lfoMode",
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
     "id": "obj-p-lfoMode",
     "maxclass": "newobj",
     "patching_rect": [
      700.0,
      950.0,
      90.0,
      22.0
     ],
     "numinlets": 1,
     "numoutlets": 1,
     "text": "prepend p lfoMode",
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "obj-d-lfoRate",
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
     "varname": "granos_lfoRate",
     "saved_attribute_attributes": {
      "valueof": {
       "parameter_longname": "LFO Rate",
       "parameter_shortname": "LFO Rate",
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
     "id": "obj-s-lfoRate",
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
     "id": "obj-p-lfoRate",
     "maxclass": "newobj",
     "patching_rect": [
      795.0,
      950.0,
      90.0,
      22.0
     ],
     "numinlets": 1,
     "numoutlets": 1,
     "text": "prepend p lfoRate",
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "obj-d-lfoShape",
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
     "varname": "granos_lfoShape",
     "saved_attribute_attributes": {
      "valueof": {
       "parameter_longname": "LFO Shape",
       "parameter_shortname": "LFO Shape",
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
     "id": "obj-s-lfoShape",
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
     "id": "obj-p-lfoShape",
     "maxclass": "newobj",
     "patching_rect": [
      890.0,
      950.0,
      90.0,
      22.0
     ],
     "numinlets": 1,
     "numoutlets": 1,
     "text": "prepend p lfoShape",
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "obj-d-lfoAmount",
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
     "varname": "granos_lfoAmount",
     "saved_attribute_attributes": {
      "valueof": {
       "parameter_longname": "LFO Amount",
       "parameter_shortname": "LFO Amount",
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
     "id": "obj-s-lfoAmount",
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
     "id": "obj-p-lfoAmount",
     "maxclass": "newobj",
     "patching_rect": [
      985.0,
      950.0,
      90.0,
      22.0
     ],
     "numinlets": 1,
     "numoutlets": 1,
     "text": "prepend p lfoAmount",
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "obj-d-lfoStereo",
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
     "varname": "granos_lfoStereo",
     "saved_attribute_attributes": {
      "valueof": {
       "parameter_longname": "LFO Stereo",
       "parameter_shortname": "LFO Stereo",
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
     "id": "obj-s-lfoStereo",
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
     "id": "obj-p-lfoStereo",
     "maxclass": "newobj",
     "patching_rect": [
      320.0,
      1060.0,
      90.0,
      22.0
     ],
     "numinlets": 1,
     "numoutlets": 1,
     "text": "prepend p lfoStereo",
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "obj-d-lfoQuant",
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
     "varname": "granos_lfoQuant",
     "saved_attribute_attributes": {
      "valueof": {
       "parameter_longname": "LFO Quant",
       "parameter_shortname": "LFO Quant",
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
     "id": "obj-s-lfoQuant",
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
     "id": "obj-p-lfoQuant",
     "maxclass": "newobj",
     "patching_rect": [
      415.0,
      1060.0,
      90.0,
      22.0
     ],
     "numinlets": 1,
     "numoutlets": 1,
     "text": "prepend p lfoQuant",
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "obj-d-lfoPhase",
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
     "varname": "granos_lfoPhase",
     "saved_attribute_attributes": {
      "valueof": {
       "parameter_longname": "LFO Phase",
       "parameter_shortname": "LFO Phase",
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
     "id": "obj-s-lfoPhase",
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
     "id": "obj-p-lfoPhase",
     "maxclass": "newobj",
     "patching_rect": [
      510.0,
      1060.0,
      90.0,
      22.0
     ],
     "numinlets": 1,
     "numoutlets": 1,
     "text": "prepend p lfoPhase",
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "obj-d-lfoRandPhase",
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
     "varname": "granos_lfoRandPhase",
     "saved_attribute_attributes": {
      "valueof": {
       "parameter_longname": "LFO Rnd Phase",
       "parameter_shortname": "LFO Rnd Phase",
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
     "id": "obj-s-lfoRandPhase",
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
     "id": "obj-p-lfoRandPhase",
     "maxclass": "newobj",
     "patching_rect": [
      605.0,
      1060.0,
      90.0,
      22.0
     ],
     "numinlets": 1,
     "numoutlets": 1,
     "text": "prepend p lfoRandPhase",
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
     "varname": "granos_bpm",
     "saved_attribute_attributes": {
      "valueof": {
       "parameter_longname": "BPM",
       "parameter_shortname": "BPM",
       "parameter_initial_enable": 1,
       "parameter_initial": [
        40
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
     "id": "obj-s-bpm",
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
     "id": "obj-p-bpm",
     "maxclass": "newobj",
     "patching_rect": [
      700.0,
      1060.0,
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
     "varname": "granos_lfoModWheel",
     "saved_attribute_attributes": {
      "valueof": {
       "parameter_longname": "LFO ModWheel",
       "parameter_shortname": "LFO ModWheel",
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
     "id": "obj-p-lfoModWheel",
     "maxclass": "newobj",
     "patching_rect": [
      795.0,
      1060.0,
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
     "id": "obj-d-lfoDiv",
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
     "varname": "granos_lfoDiv",
     "saved_attribute_attributes": {
      "valueof": {
       "parameter_longname": "LFO Sync",
       "parameter_shortname": "LFO Sync",
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
     "id": "obj-s-lfoDiv",
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
     "id": "obj-p-lfoDiv",
     "maxclass": "newobj",
     "patching_rect": [
      890.0,
      1060.0,
      90.0,
      22.0
     ],
     "numinlets": 1,
     "numoutlets": 1,
     "text": "prepend p lfoDiv",
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "obj-d-lfoAudio",
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
     "varname": "granos_lfoAudio",
     "saved_attribute_attributes": {
      "valueof": {
       "parameter_longname": "LFO Audio Rate",
       "parameter_shortname": "LFO Audio Rate",
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
     "id": "obj-s-lfoAudio",
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
     "id": "obj-p-lfoAudio",
     "maxclass": "newobj",
     "patching_rect": [
      985.0,
      1060.0,
      90.0,
      22.0
     ],
     "numinlets": 1,
     "numoutlets": 1,
     "text": "prepend p lfoAudio",
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
      "obj-s-mode",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-s-mode",
      0
     ],
     "destination": [
      "obj-d-mode",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-d-mode",
      0
     ],
     "destination": [
      "obj-p-mode",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-p-mode",
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
      "obj-d-mode",
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
      "obj-s-position",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-s-position",
      0
     ],
     "destination": [
      "obj-d-position",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-d-position",
      0
     ],
     "destination": [
      "obj-p-position",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-p-position",
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
      "obj-d-position",
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
      "obj-s-size",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-s-size",
      0
     ],
     "destination": [
      "obj-d-size",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-d-size",
      0
     ],
     "destination": [
      "obj-p-size",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-p-size",
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
      "obj-d-size",
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
      "obj-s-shape",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-s-shape",
      0
     ],
     "destination": [
      "obj-d-shape",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-d-shape",
      0
     ],
     "destination": [
      "obj-p-shape",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-p-shape",
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
      "obj-d-shape",
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
      "obj-s-reverse",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-s-reverse",
      0
     ],
     "destination": [
      "obj-d-reverse",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-d-reverse",
      0
     ],
     "destination": [
      "obj-p-reverse",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-p-reverse",
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
      "obj-d-reverse",
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
      "obj-s-density",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-s-density",
      0
     ],
     "destination": [
      "obj-d-density",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-d-density",
      0
     ],
     "destination": [
      "obj-p-density",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-p-density",
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
      "obj-d-density",
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
      "obj-s-spread",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-s-spread",
      0
     ],
     "destination": [
      "obj-d-spread",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-d-spread",
      0
     ],
     "destination": [
      "obj-p-spread",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-p-spread",
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
      "obj-d-spread",
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
      9
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
      10
     ],
     "destination": [
      "obj-s-tune",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-s-tune",
      0
     ],
     "destination": [
      "obj-d-tune",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-d-tune",
      0
     ],
     "destination": [
      "obj-p-tune",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-p-tune",
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
      "obj-d-tune",
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
      12
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
      13
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
      14
     ],
     "destination": [
      "obj-s-scanSpeed",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-s-scanSpeed",
      0
     ],
     "destination": [
      "obj-d-scanSpeed",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-d-scanSpeed",
      0
     ],
     "destination": [
      "obj-p-scanSpeed",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-p-scanSpeed",
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
      "obj-d-scanSpeed",
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
      "obj-s-scanDist",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-s-scanDist",
      0
     ],
     "destination": [
      "obj-d-scanDist",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-d-scanDist",
      0
     ],
     "destination": [
      "obj-p-scanDist",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-p-scanDist",
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
      "obj-d-scanDist",
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
      "obj-s-scanLoop",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-s-scanLoop",
      0
     ],
     "destination": [
      "obj-d-scanLoop",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-d-scanLoop",
      0
     ],
     "destination": [
      "obj-p-scanLoop",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-p-scanLoop",
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
      "obj-d-scanLoop",
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
      "obj-s-variation",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-s-variation",
      0
     ],
     "destination": [
      "obj-d-variation",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-d-variation",
      0
     ],
     "destination": [
      "obj-p-variation",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-p-variation",
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
      "obj-d-variation",
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
      "obj-s-varPos",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-s-varPos",
      0
     ],
     "destination": [
      "obj-d-varPos",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-d-varPos",
      0
     ],
     "destination": [
      "obj-p-varPos",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-p-varPos",
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
      "obj-d-varPos",
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
      "obj-s-varSize",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-s-varSize",
      0
     ],
     "destination": [
      "obj-d-varSize",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-d-varSize",
      0
     ],
     "destination": [
      "obj-p-varSize",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-p-varSize",
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
      "obj-d-varSize",
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
      "obj-s-varPitch",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-s-varPitch",
      0
     ],
     "destination": [
      "obj-d-varPitch",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-d-varPitch",
      0
     ],
     "destination": [
      "obj-p-varPitch",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-p-varPitch",
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
      "obj-d-varPitch",
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
      "obj-s-varVol",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-s-varVol",
      0
     ],
     "destination": [
      "obj-d-varVol",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-d-varVol",
      0
     ],
     "destination": [
      "obj-p-varVol",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-p-varVol",
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
      "obj-d-varVol",
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
      23
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
      24
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
      25
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
      26
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
      27
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
      28
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
      29
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
      30
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
      31
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
      32
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
      33
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
      34
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
      35
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
      36
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
      37
     ],
     "destination": [
      "obj-s-lfoMode",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-s-lfoMode",
      0
     ],
     "destination": [
      "obj-d-lfoMode",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-d-lfoMode",
      0
     ],
     "destination": [
      "obj-p-lfoMode",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-p-lfoMode",
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
      "obj-d-lfoMode",
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
      "obj-s-lfoRate",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-s-lfoRate",
      0
     ],
     "destination": [
      "obj-d-lfoRate",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-d-lfoRate",
      0
     ],
     "destination": [
      "obj-p-lfoRate",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-p-lfoRate",
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
      "obj-d-lfoRate",
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
      "obj-s-lfoShape",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-s-lfoShape",
      0
     ],
     "destination": [
      "obj-d-lfoShape",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-d-lfoShape",
      0
     ],
     "destination": [
      "obj-p-lfoShape",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-p-lfoShape",
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
      "obj-d-lfoShape",
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
      "obj-s-lfoAmount",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-s-lfoAmount",
      0
     ],
     "destination": [
      "obj-d-lfoAmount",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-d-lfoAmount",
      0
     ],
     "destination": [
      "obj-p-lfoAmount",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-p-lfoAmount",
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
      "obj-d-lfoAmount",
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
      "obj-s-lfoStereo",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-s-lfoStereo",
      0
     ],
     "destination": [
      "obj-d-lfoStereo",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-d-lfoStereo",
      0
     ],
     "destination": [
      "obj-p-lfoStereo",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-p-lfoStereo",
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
      "obj-d-lfoStereo",
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
      "obj-s-lfoQuant",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-s-lfoQuant",
      0
     ],
     "destination": [
      "obj-d-lfoQuant",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-d-lfoQuant",
      0
     ],
     "destination": [
      "obj-p-lfoQuant",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-p-lfoQuant",
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
      "obj-d-lfoQuant",
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
      "obj-s-lfoPhase",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-s-lfoPhase",
      0
     ],
     "destination": [
      "obj-d-lfoPhase",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-d-lfoPhase",
      0
     ],
     "destination": [
      "obj-p-lfoPhase",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-p-lfoPhase",
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
      "obj-d-lfoPhase",
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
      "obj-s-lfoRandPhase",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-s-lfoRandPhase",
      0
     ],
     "destination": [
      "obj-d-lfoRandPhase",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-d-lfoRandPhase",
      0
     ],
     "destination": [
      "obj-p-lfoRandPhase",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-p-lfoRandPhase",
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
      "obj-d-lfoRandPhase",
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
      46
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
      47
     ],
     "destination": [
      "obj-s-lfoDiv",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-s-lfoDiv",
      0
     ],
     "destination": [
      "obj-d-lfoDiv",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-d-lfoDiv",
      0
     ],
     "destination": [
      "obj-p-lfoDiv",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-p-lfoDiv",
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
      "obj-d-lfoDiv",
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
      "obj-s-lfoAudio",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-s-lfoAudio",
      0
     ],
     "destination": [
      "obj-d-lfoAudio",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-d-lfoAudio",
      0
     ],
     "destination": [
      "obj-p-lfoAudio",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-p-lfoAudio",
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
      "obj-d-lfoAudio",
      0
     ]
    }
   }
  ],
  "parameters": {
   "obj-d-mode": [
    "Modo",
    "Modo",
    0
   ],
   "obj-d-position": [
    "Position",
    "Position",
    0
   ],
   "obj-d-size": [
    "Grain Size",
    "Grain Size",
    0
   ],
   "obj-d-shape": [
    "Shape",
    "Shape",
    0
   ],
   "obj-d-reverse": [
    "Reverse",
    "Reverse",
    0
   ],
   "obj-d-density": [
    "Density",
    "Density",
    0
   ],
   "obj-d-spread": [
    "Spread",
    "Spread",
    0
   ],
   "obj-d-volume": [
    "Volume",
    "Volume",
    0
   ],
   "obj-d-transpose": [
    "Transpose",
    "Transpose",
    0
   ],
   "obj-d-tune": [
    "Tune",
    "Tune",
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
   "obj-d-scanSpeed": [
    "Scan Speed",
    "Scan Speed",
    0
   ],
   "obj-d-scanDist": [
    "Scan Dist",
    "Scan Dist",
    0
   ],
   "obj-d-scanLoop": [
    "Scan Loop",
    "Scan Loop",
    0
   ],
   "obj-d-variation": [
    "Var Amount",
    "Var Amount",
    0
   ],
   "obj-d-varPos": [
    "Var Position",
    "Var Position",
    0
   ],
   "obj-d-varSize": [
    "Var Size",
    "Var Size",
    0
   ],
   "obj-d-varPitch": [
    "Var Transp",
    "Var Transp",
    0
   ],
   "obj-d-varVol": [
    "Var Volume",
    "Var Volume",
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
   "obj-d-lfoMode": [
    "LFO Mode",
    "LFO Mode",
    0
   ],
   "obj-d-lfoRate": [
    "LFO Rate",
    "LFO Rate",
    0
   ],
   "obj-d-lfoShape": [
    "LFO Shape",
    "LFO Shape",
    0
   ],
   "obj-d-lfoAmount": [
    "LFO Amount",
    "LFO Amount",
    0
   ],
   "obj-d-lfoStereo": [
    "LFO Stereo",
    "LFO Stereo",
    0
   ],
   "obj-d-lfoQuant": [
    "LFO Quant",
    "LFO Quant",
    0
   ],
   "obj-d-lfoPhase": [
    "LFO Phase",
    "LFO Phase",
    0
   ],
   "obj-d-lfoRandPhase": [
    "LFO Rnd Phase",
    "LFO Rnd Phase",
    0
   ],
   "obj-d-bpm": [
    "BPM",
    "BPM",
    0
   ],
   "obj-d-lfoModWheel": [
    "LFO ModWheel",
    "LFO ModWheel",
    0
   ],
   "obj-d-lfoDiv": [
    "LFO Sync",
    "LFO Sync",
    0
   ],
   "obj-d-lfoAudio": [
    "LFO Audio Rate",
    "LFO Audio Rate",
    0
   ],
   "parameterbanks": {
    "0": {
     "index": 0,
     "name": "Grano",
     "parameters": [
      "Modo",
      "Position",
      "Grain Size",
      "Shape",
      "Reverse",
      "Density",
      "Spread",
      "Volume"
     ]
    },
    "1": {
     "index": 1,
     "name": "Nota",
     "parameters": [
      "Transpose",
      "Tune",
      "PB Range",
      "Mono",
      "Glide",
      "Scan Speed",
      "Scan Dist",
      "Scan Loop"
     ]
    },
    "2": {
     "index": 2,
     "name": "Variacion",
     "parameters": [
      "Var Amount",
      "Var Position",
      "Var Size",
      "Var Transp",
      "Var Volume",
      "-",
      "-",
      "-"
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
     "name": "LFO 1",
     "parameters": [
      "LFO Mode",
      "LFO Rate",
      "LFO Shape",
      "LFO Amount",
      "LFO Stereo",
      "LFO Quant",
      "LFO Phase",
      "LFO Rnd Phase"
     ]
    },
    "7": {
     "index": 7,
     "name": "LFO 2",
     "parameters": [
      "BPM",
      "LFO ModWheel",
      "LFO Sync",
      "LFO Audio Rate",
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