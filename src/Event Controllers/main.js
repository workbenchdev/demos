import { gettext as _ } from "gettext";
import Gdk from "gi://Gdk";
import Gio from "gi://Gio";
import Gtk from "gi://Gtk";

const window = workbench.window;
const ctrl_button = workbench.builder.get_object("ctrl_button");
const stack = workbench.builder.get_object("stack");
const stack_picture_1 = workbench.builder.get_object("stack_picture_1");
const stack_picture_2 = workbench.builder.get_object("stack_picture_2");
const primary_button = workbench.builder.get_object("primary_button");
const middle_button = workbench.builder.get_object("middle_button");
const secondary_button = workbench.builder.get_object("secondary_button");

stack_picture_1.file = Gio.File.new_for_uri(workbench.resolve("image1.png"));
stack_picture_2.file = Gio.File.new_for_uri(workbench.resolve("image2.png"));

// Key controller to detect when the Ctrl key is pressed and released
const key_controller = new Gtk.EventControllerKey();
window.add_controller(key_controller);
key_controller.connect("key-pressed", (_self, keyval, _keycode, _state) => {
  if (keyval === Gdk.KEY_Control_L || keyval === Gdk.KEY_Control_R) {
    ctrl_button.add_css_class("suggested-action");
  }
});

key_controller.connect("key-released", (_self, keyval, _keycode, _state) => {
  if (keyval === Gdk.KEY_Control_L || keyval === Gdk.KEY_Control_R) {
    ctrl_button.remove_css_class("suggested-action");
  }
});

// Detect pointer button press and release events
const gesture_click = new Gtk.GestureClick({ button: 0 });

window.add_controller(gesture_click);

gesture_click.connect("pressed", (_self, _n_press, _x, _y) => {
  let css_class = "suggested-action";
  if (_self.get_current_event_state() & Gdk.ModifierType.CONTROL_MASK) {
    css_class = "destructive-action";
  }

  switch (_self.get_current_button()) {
    case Gdk.BUTTON_PRIMARY:
      primary_button.add_css_class(css_class);
      break;

    case Gdk.BUTTON_MIDDLE:
      middle_button.add_css_class(css_class);
      break;

    case Gdk.BUTTON_SECONDARY:
      secondary_button.add_css_class(css_class);
      break;
  }
});

gesture_click.connect("released", (_self, _n_press, _x, _y) => {
  switch (_self.get_current_button()) {
    case Gdk.BUTTON_PRIMARY:
      primary_button.remove_css_class("suggested-action");
      primary_button.remove_css_class("destructive-action");
      break;

    case Gdk.BUTTON_MIDDLE:
      middle_button.remove_css_class("suggested-action");
      middle_button.remove_css_class("destructive-action");
      break;

    case Gdk.BUTTON_SECONDARY:
      secondary_button.remove_css_class("suggested-action");
      secondary_button.remove_css_class("destructive-action");
      break;
  }
});

const gesture_swipe = new Gtk.GestureSwipe();

stack.add_controller(gesture_swipe);

gesture_swipe.connect("swipe", (_self, vel_x, _vel_y) => {
  if (vel_x > 0) {
    stack.set_visible_child_name("stack_picture_1");
  } else {
    stack.set_visible_child_name("stack_picture_2");
  }
});
