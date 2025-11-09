# The script of the game goes in this file.

# Declare characters used by this game. The color argument colorizes the
# name of the character.

define b = Character("Capstone")



# The game starts here.  
label start:

    # Show a background. This uses a placeholder by default, but you can
    # add a file (named either "bg room.png" or "bg room.jpg") to the
    # images directory to show it.

    image bg livingroom_scaled = im.Scale("Hospital_room.PNG", 1920, 1080)
    scene bg livingroom_scaled
    # This shows a character sprite. A placeholder is used, but you can
    # replace it by adding a file named "eileen happy.png" to the images
    # directory.

    show duck_mascot at sprite_small # xpos and ypos are relative to screen width/height (0.0 to 1.0)

    # These display lines of dialogue.

    b "Welcome to the Nursing Sim+."

    b "We don't have much right now..."
    play sound "audio/mmMusic.mp3" loop
    b "Enjoy the music!"

    # This ends the game.

    return
