#! /usr/bin/env -S vala workbench.vala --pkg libadwaita-1

public void main () {
    var button = (Gtk.Button) workbench.builder.get_object ("button");

    button.query_tooltip.connect ((button, _x, _y, _keyboard_mode, tooltip) => {
        Gtk.Box custom_tooltip = new Gtk.Box (Gtk.Orientation.HORIZONTAL, 6);
        Gtk.Label label = new Gtk.Label ("This is a custom tooltip");
        Gtk.Image icon = new Gtk.Image.from_icon_name ("emoji-body-symbolic");

        custom_tooltip.append (label);
        custom_tooltip.append (icon);

        tooltip.set_custom (custom_tooltip);
        return true;
    });
}
