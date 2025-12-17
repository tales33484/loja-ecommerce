import React, { useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../firebase/config";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

const TagInput = ({ titleKey, descriptionKey, docName, color }) => {
  const { t } = useTranslation();
  const [inputValue, setInputValue] = useState("");
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(false);

  const ref = doc(db, "blacklist", docName);

  // 🔄 Load words
  useEffect(() => {
    const load = async () => {
      const snap = await getDoc(ref);
      if (snap.exists()) {
        setTags(snap.data().words || []);
      }
    };
    load();
  }, []);

  // 💾 Save to Firestore
  const save = async (newTags) => {
    setLoading(true);
    try {
      await setDoc(ref, { words: newTags }, { merge: true });
      setTags(newTags);
      toast.success(t("adminBlacklist.toast.updated"));
    } catch (err) {
      console.error(err);
      toast.error(t("adminBlacklist.toast.error"));
    } finally {
      setLoading(false);
    }
  };

  const addTag = () => {
    if (!inputValue.trim()) return;
    if (tags.includes(inputValue.trim())) return;

    save([...tags, inputValue.trim()]);
    setInputValue("");
  };

  const removeTag = (tag) => {
    save(tags.filter((t) => t !== tag));
  };

  return (
    <div className="border border-base-300 rounded-md p-4 mt-3">
      <h3 className={`font-semibold ${color}`}>
        {t(titleKey)}
      </h3>

      <p className="text-sm opacity-70 mb-3">
        {t(descriptionKey)}
      </p>

      <div className="flex gap-2 mb-3">
        <input
          className="input input-bordered input-sm w-full"
          placeholder={t("adminBlacklist.input.placeholder")}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTag()}
        />

        <button
          className="btn btn-sm btn-primary"
          onClick={addTag}
          disabled={loading}
        >
          {t("adminBlacklist.input.add")}
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="badge badge-outline cursor-pointer"
            onClick={() => removeTag(tag)}
            title={t("adminBlacklist.input.removeHint")}
          >
            {tag} ✕
          </span>
        ))}
      </div>
    </div>
  );
};

const AdminBlacklist = () => {
  const { t } = useTranslation();

  return (
    <section className="p-4 bg-base-200 rounded-md">
      <h2 className="text-lg font-bold mb-4">
        {t("adminBlacklist.title")}
      </h2>

      <TagInput
        titleKey="adminBlacklist.delete.title"
        descriptionKey="adminBlacklist.delete.description"
        docName="delete"
        color="text-error"
      />

      <TagInput
        titleKey="adminBlacklist.censor.title"
        descriptionKey="adminBlacklist.censor.description"
        docName="censor"
        color="text-warning"
      />
    </section>
  );
};

export default AdminBlacklist;
