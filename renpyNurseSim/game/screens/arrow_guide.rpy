# game/screens/arrow_guide.rpy

init python:
    # global flag to show/hide the arrow
    show_back_arrow = True

transform arrow_bounce:
    linear 0.35 yoffset -6
    linear 0.35 yoffset 0
    repeat

screen back_arrow_guide():
    layer "overlay"

    if show_back_arrow:
        # scaled, pixel positioned arrow
        add "gui/down_arrow.png" at arrow_bounce xpos 570 ypos 980 xysize (80, 80)

        # clickable hit area matches the image size/position
        button:
            background None
            xpos 220
            ypos 220
            xsize 80
            ysize 80
            action [SetVariable("show_back_arrow", False), Rollback()]
screen help_arrow_guide():
    layer "overlay"

    if show_back_arrow:
        # scaled, pixel positioned arrow
        add "gui/down_arrow.png" at arrow_bounce xpos 1275 ypos 980 xysize (80, 80)

        # clickable hit area matches the image size/position
        button:
            background None
            xpos 220
            ypos 220
            xsize 80
            ysize 80
            action [SetVariable("show_back_arrow", False), Rollback()]