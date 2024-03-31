use crate::workbench;
use gtk::prelude::*;

pub fn main() {
    let linkbutton: gtk::LinkButton = workbench::builder().object("linkbutton").unwrap();

    linkbutton.connect_activate_link(|button| {
        println!("About to activate {}", button.uri());
        return false.into();
    });

    linkbutton.connect_notify(Some("visited"), |_, _| {
        println!("The link has been visited");
    });
}
