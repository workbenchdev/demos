#! /usr/bin/env -S vala workbench.vala --pkg gtk4

public void main () {
    var button_slide = workbench.builder.get_object ("button_slide") as Gtk.ToggleButton;
    var button_crossfade = workbench.builder.get_object ("button_crossfade") as Gtk.ToggleButton;
    var revealer_slide = workbench.builder.get_object ("revealer_slide") as Gtk.Revealer;
    var revealer_crossfade = workbench.builder.get_object ("revealer_crossfade") as Gtk.Revealer;
    var image1 = workbench.builder.get_object ("image1") as Gtk.Picture;
    var image2 = workbench.builder.get_object ("image2") as Gtk.Picture;

    var image1_file = File.new_for_uri (workbench.resolve ("image1.png"));
    var image2_file = File.new_for_uri (workbench.resolve ("image2.png"));

    image1.file = image1_file;
    image2.file = image2_file;

    button_slide.toggled.connect (() => {
        revealer_slide.reveal_child = button_slide.active;
    });

    button_crossfade.toggled.connect (() => {
        revealer_crossfade.reveal_child = button_crossfade.active;
    });

    revealer_slide.notify["child-revealed"].connect (() => {
        if (revealer_slide.child_revealed) {
            message ("Slide Revealer Shown");
        } else {
            message ("Slide Revealer Hidden");
        }
    });
}
