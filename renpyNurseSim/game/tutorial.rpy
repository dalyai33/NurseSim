# The tutorial script of the game goes in this file.

# Declare characters used by this game. The color argument colorizes the
# name of the character.
define b = Character("Capstone")

# Sizing for our mascott
transform sprite_small:
 # xpos and ypos are relative to screen width/height (0.0 to 1.0)
    xalign 0.5
    yalign 0.6
    zoom 0.25



label tutorial:
    # Show a background. This uses a placeholder by default, but you can
    # add a file (named either "bg room.png" or "bg room.jpg") to the
    # images directory to show it.

    image bgt livingroom_scaled = im.Scale("Hospital_Room.PNG", 1920, 1080)
    scene bg livingroom_scaled

    # Shows our character sprite, may change later on
    show duck_mascot at sprite_small

    # Dialogue
    b "Welcome to the Nursing Sim+ Tutorial."

    # Probably a new photo of ducky waving his hand saying hello
    #show Duck_Mascot at Position(xpos=0.5, ypos=0.6)
    b "I'm Capstone, your own personal AI assistant!"
    b "Its time for me to teach you how to play the simulator."

    # New photo
    # show Duck_Mascot at Position(xpos=0.5, ypos=0.6)
    b "Lets first start off with a question to test your knowledge"



label tutorial_q1:

    # These questions would normally be AI created, but for tutorial we will have Capstone
    # ask this hardcoded question
    # b "What does the prefix 'hemo-' correlate with?"

    $ answers = [
        ("1) Blood", "blood"),
        ("2) Liver", "liver"),
        ("3) Bone", "bone"),
        ("4) Skin", "skin"),
    ]
    # call the screen and get the returned value
    $ choice = renpy.call_screen("mcq", "What does the prefix 'hemo-' correlate with?", answers)

    if choice == "blood":
        b "Correct! 'Hemo-' relates to blood."
    else:
        b "Not quite. Lets click the help button and get a hint."