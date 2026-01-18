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


# Start label — make sure your game starts here (or call this label from your menu)
label start_tutorial:
    call tutorial_flow
    # continue game...
    return

label tutorial_flow:
    # Run the intro tutorial
    call tutorial

    # Run the question once
    call tutorial_q1

    # Line shown after the first question
    b "Wow! I didn't realize how smart you were, I never got to show you the help functionality. Lets try that again, and this time, hit the Help button."
    show screen help_arrow_guide
    # Run the question a second time
    call tutorial_q1

    # Finished Tutorial
    b "Congrats! You are practically a pro now at using the NurseSim+ Simulator. We hope you enjoy your learning!"
    return

label tutorial:
    image bgt livingroom_scaled = im.Scale("Hospital_Room.PNG", 1920, 1080)
    scene bg livingroom_scaled

    show duck_mascot at sprite_small

    b "Welcome to the Nursing Sim+ Tutorial."
    b "I'm Capstone, your own personal AI assistant!"
    b "Its time for me to teach you how to play the simulator."
    b "Lets first start off with a question to test your knowledge"

    return

label tutorial_q1:
    $ answers = [
        ("1) Blood", "blood"),
        ("2) Liver", "liver"),
        ("3) Bone", "bone"),
        ("4) Skin", "skin"),
    ]

    $ choice = renpy.call_screen("mcq", "What does the prefix 'hemo-' correlate with?", answers)

    if choice == "blood":
        $ q1_correct = True
        b "Correct! 'Hemo-' relates to blood."
    else:
        $ q1_correct = False
        $ show_back_arrow = True
        show screen back_arrow_guide
        b "Not quite. Lets click that little back button at the bottom of your screen and give it another try."

    return
