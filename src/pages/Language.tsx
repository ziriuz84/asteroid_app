import { BackMenu } from "../components/BackMenu";
import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";

/**
 * React component for language setting
 *
 * @returns the component
 */
export const Language = () => {
  const [selectedLang, setSelectedLang] = useState<string | null>(null);

  /** get language from config file */
  const getLang = async (): Promise<void> => {
    const lang: string = await invoke("get_lang");
    setSelectedLang(lang);
  };

  /**
   * Set the new language
   *
   * @param lang - new language to be setted
   */
  const setLang = async (lang: string): Promise<void> => {
    await invoke("set_lang", { lang });
    const buttons = document.querySelectorAll(".lang");
    buttons.forEach(item => item.classList.remove('active'))
    const selectedElement = document.getElementById(lang);
    if (selectedElement) {
      selectedElement.classList.add('active');
    }
  }

  useEffect(() => {
    getLang();
  }, []);

  useEffect(() => {
    if (selectedLang) {
      const selectedElement = document.getElementById(selectedLang);
      if (selectedElement) {
        selectedElement.classList.add('active');
      }
      setLang(selectedLang);
    }
  }, [selectedLang]);

  return (
    <div>
      <div className="form">
        <div className="lang button" id="en" onClick={() => setLang("en")}>English</div>
      </div>
      <BackMenu backto="/configuration" />
    </div>
  );
};

