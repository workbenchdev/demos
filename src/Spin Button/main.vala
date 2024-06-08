#! /usr/bin/env -S vala workbench.vala --pkg libadwaita-1

string tell_time (Gtk.SpinButton hours, Gtk.SpinButton minutes) {
    return (@"The time selected is $(hours.text):$(minutes.text)");
}

public void main () {
    var hours = (Gtk.SpinButton) workbench.builder.get_object ("hours");
    var minutes = (Gtk.SpinButton) workbench.builder.get_object ("minutes");

    hours.text = "00";
    minutes.text = "00";

    hours.value_changed.connect (() => {
        message (@"$(tell_time (hours, minutes))");
    });

    minutes.value_changed.connect (() => {
        message (@"$(tell_time (hours, minutes))");
    });


    hours.output.connect (() => {
        double value = hours.adjustment.value;
        hours.set_text ("%02d".printf ((int) value));
        return true;
    });

    minutes.output.connect (() => {
        double value = minutes.adjustment.value;
        minutes.set_text ("%02d".printf ((int) value));
        return true;
    });

    // This only works for one direction
    // Add any extra logic to account for wrapping in both directions
    minutes.wrapped.connect (() => {
        hours.spin (STEP_FORWARD, 1);
    });
}
