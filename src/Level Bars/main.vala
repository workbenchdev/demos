#! /usr/bin/env -S vala workbench.vala --pkg gtk4

public void main () {

    var bar_continuous = (Gtk.LevelBar) workbench.builder.get_object ("bar_continuous");

    bar_continuous.add_offset_value ("full", 100);
    bar_continuous.add_offset_value ("half", 50);
    bar_continuous.add_offset_value ("low", 25);

    var bar_discrete = (Gtk.LevelBar) workbench.builder.get_object ("bar_discrete");

    bar_discrete.add_offset_value ("very-weak", 1);
    bar_discrete.add_offset_value ("weak", 2);
    bar_discrete.add_offset_value ("moderate", 4);
    bar_discrete.add_offset_value ("strong", 6);


    var entry = (Gtk.Entry) workbench.builder.get_object ("entry");

    var label_strength = (Gtk.Label) workbench.builder.get_object ("label_strength");

    entry.notify["text"].connect(estimatePasswordStrength);
}

// This is not a secure way to estimate password strength
// Use appropriate solutions instead
// such as https://github.com/dropbox/zxcvbn

public void estimate_password_strength() {
    var level = Math.fmin(Math.ceil(entry.text.length / 2), 6);

    switch (level) {
        case 1:
            label_strength.label = "Very Weak";
            label_strength.add_css_class("very-weak-label");
            break;
        case 2:
            label_strength.label = "Weak";
            label_strength.add_css_class("weak-label");
            break;
        case 3:
        case 4:
            label_strength.label = "Moderate";
            label_strength.add_css_class("moderate-label");
            break;
        case 5:
        case 6:
            label_strength.label = "Strong";
            label_strength.add_css_class("strong-label");
            break;
        default:
            label_strength.label = "";
            label_strength.add_css_class("");
    }

    bar_discrete.value = level;
}
