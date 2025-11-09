screen help_popup():
    modal True
    layer "master"

    # dim whole background
    add Solid("#00000088") xalign 0.5 yalign 0.5

    frame:
        xalign 0.75
        yalign 0.5
        xsize 360
        ysize 200
        padding (12,12)
        vbox:
            spacing 8
            text "Capstone" size 26 color "#d05a00" bold True
            text "pssst.... it's what flows through your veins" size 18

    textbutton "Close" action Hide("help_popup"):
        xalign 0.75
        yalign 0.75
        padding (6,6)