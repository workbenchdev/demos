#!/usr/bin/env -S vala workbench.vala --pkg gtk4 --pkg libadwaita-1

public void main() {
  Gtk.init();

  var box_menu_parent =
      workbench.builder.get_object("box_menu_parent") as Gtk.Box;
  var label_emoji =
      workbench.builder.get_object("label_emoji") as Gtk.Label;
  var gesture_click =
      workbench.builder.get_object("gesture_click") as Gtk.GestureClick;
  var popover_menu =
      workbench.builder.get_object("popover_menu") as Gtk.PopoverMenu;

  gesture_click.pressed.connect((_gesture, _n_press, x, y) => {
    var position = Gdk.Rectangle() { x = (int)x, y = (int)y };
    popover_menu.set_pointing_to(position);
    popover_menu.popup();
  });

  var mood_group = new SimpleActionGroup();
  box_menu_parent.insert_action_group("mood", mood_group);

  var emoji_action = new SimpleAction("emoji", new GLib.VariantType("s"));

  emoji_action.activate.connect((_action, parameter) => { label_emoji.label = parameter.get_string(); });
  mood_group.add_action(emoji_action);
}
