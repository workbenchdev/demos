from gi.repository import Gtk, Gio

window: Gtk.Window
builder: Gtk.Builder

def resolve(self, path: str) -> Gio.File:
  ...
