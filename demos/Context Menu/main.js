import Gdk from "gi://Gdk";
import Gio from "gi://Gio";

const box_menu_parent = workbench.builder.get_object("box_menu_parent");
const label_emoji = workbench.builder.get_object("label_emoji");
const gesture_click = workbench.builder.get_object("gesture_click");
const popover_menu = workbench.builder.get_object("popover_menu");

gesture_click.connect("pressed", (_, __, x, y) => {
  const position = new Gdk.Rectangle();
  position.x = x;
  position.y = y;
  popover_menu.set_pointing_to(position);
  popover_menu.popup();
});

const mood_group = new Gio.SimpleActionGroup();
box_menu_parent.insert_action_group("mood", mood_group);

const happy_action = new Gio.SimpleAction({
  name: "happy",
});

happy_action.connect("activate", () => {
  label_emoji.label = "😀";
});
mood_group.add_action(happy_action);

const start_struck_action = new Gio.SimpleAction({
  name: "start-struck",
});

start_struck_action.connect("activate", () => {
  label_emoji.label = "🤩";
});
mood_group.add_action(start_struck_action);

const partying_action = new Gio.SimpleAction({
  name: "partying",
});

partying_action.connect("activate", () => {
  label_emoji.label = "🥳";
});
mood_group.add_action(partying_action);
