import gi

gi.require_version("Gtk", "4.0")
from gi.repository import Gtk
import workbench

hours: Gtk.SpinButton = workbench.builder.get_object("hours")
minutes: Gtk.SpinButton = workbench.builder.get_object("minutes")

hours.set_text("00")
minutes.set_text("00")


def tell_time(hours, minutes):
    return f"The time selected is {hours.get_text()}:{minutes.get_text()}"


def on_value_changed(spin_button):
    value = spin_button.get_adjustment().get_value()
    spin_button.set_text(f"{int(value):02}")
    return True


hours.connect("value-changed", lambda *_args: print(tell_time(hours, minutes)))
minutes.connect("value-changed", lambda *_args: print(tell_time(hours, minutes)))


hours.connect("output", on_value_changed)

minutes.connect("output", on_value_changed)


# This only works for one direction
# Add any extra logic to account for wrapping in both directions
minutes.connect("wrapped", lambda *_args: hours.spin(Gtk.SpinType.STEP_FORWARD, 1))
