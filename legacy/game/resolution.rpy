# # 1) Create persistent value as early as possible.
# init python early:
#     if not hasattr(persistent, "game_res"):
#         persistent.game_res = (1920, 1080)

# # 2) Apply the chosen resolution during init.
# init -1 python:
#     def apply_resolution():
#         w, h = persistent.game_res
#         gui.init(w, h)                 # updates GUI & virtual resolution
#         config.screen_width  = w
#         config.screen_height = h
#     apply_resolution()

# # 3) Settings screen the player can open from Preferences.
# screen resolution_settings():
#     tag menu
#     frame:
#         padding (30, 30)
#         vbox:
#             spacing 12
#             label "Resolution"
#             text "Changing resolution restarts the game to redraw the UI."

#             textbutton "1280 × 720" action [
#                 SetField(persistent, "game_res", (1280, 720)),
#                 Function(renpy.quit, relaunch=True)
#             ]
#             textbutton "1600 × 900" action [
#                 SetField(persistent, "game_res", (1600, 900)),
#                 Function(renpy.quit, relaunch=True)
#             ]
#             textbutton "1920 × 1080 (Default)" action [
#                 SetField(persistent, "game_res", (1920, 1080)),
#                 Function(renpy.quit, relaunch=True)
#             ]

#             textbutton "Return" action Return()