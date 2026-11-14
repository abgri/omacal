//! Personal fork boundaries. Never reuse the official app's credential or state names.
pub(crate) const APP_ID: &str = "com.brianacklen.omacal";
pub(crate) const SLUG: &str = "omacal-brian";
pub(crate) const KEYRING_SERVICE: &str = "omacal-brian";
pub(crate) const CONFIG_RELATIVE_PATH: &str = ".config/omacal-brian/config.toml";

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn identity_matches_bundle_and_does_not_reuse_official_storage() {
        let config: serde_json::Value =
            serde_json::from_str(include_str!("../tauri.conf.json")).unwrap();
        assert_eq!(config["identifier"], APP_ID);
        assert_eq!(config["productName"], "OmaCal Brian");
        assert_eq!(config["mainBinaryName"], SLUG);
        let macos: serde_json::Value =
            serde_json::from_str(include_str!("../tauri.macos.conf.json")).unwrap();
        assert_eq!(macos["productName"], config["productName"]);
        assert_ne!(APP_ID, "com.omacal.app");
        assert_ne!(KEYRING_SERVICE, "omacal");
        assert_ne!(CONFIG_RELATIVE_PATH, ".config/omacal/config.toml");
        assert!(CONFIG_RELATIVE_PATH.contains(SLUG));
        assert_eq!(config["bundle"]["createUpdaterArtifacts"], false);
        assert!(config.get("plugins").and_then(|p| p.get("updater")).is_none());
    }
}
