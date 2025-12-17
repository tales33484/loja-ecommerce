import React, { useRef, useState } from "react";
import { Header } from "../../components";
import { CiPhone } from "react-icons/ci";
import { AiOutlineMail, AiOutlineTwitter } from "react-icons/ai";
import emailjs from "@emailjs/browser";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

const Contact = () => {
  const { t } = useTranslation();

  const formRef = useRef();
  const [loading, setLoading] = useState(false);

  const sendEmail = (e) => {
    e.preventDefault();
    setLoading(true);

    emailjs
      .sendForm(
        "service_rn5uwdh",
        "template_z55djla",
        formRef.current,
        "onCf_FZuuuG_27Kb_"
      )
      .then(
        () => toast.success(t("contact.success_message")),
        () => toast.error(t("contact.error_message"))
      )
      .finally(() => {
        setLoading(false);
        e.target.reset();
      });
  };

  return (
    <>
      <Header text={t("contact.page_title")} />

      <main className="w-full mx-auto px-2 lg:w-9/12 md:px-6 mt-6 flex flex-col md:flex-row gap-10">
        {/* Contact Info */}
        <section className="card bg-base-100 text-base-content shadow-md w-full md:w-[30rem]">
          <div className="card-body">
            <div className="mb-6">
              <h1 className="card-title text-2xl md:text-3xl">
                {t("contact.info_title")}
              </h1>
              <p className="text-base-content/70">
                {t("contact.info_description")}
              </p>
            </div>

            <div className="space-y-3 text-lg">
              <div className="flex items-center gap-2">
                <AiOutlineMail className="text-primary" />
                <a className="link link-hover" href="mailto:tales.57@proton.me">
                  tales.57@proton.me
                </a>
              </div>

              <div className="flex items-center gap-2">
                <CiPhone className="text-primary" />
                <a className="link link-hover" href="tel:+91-123-12345">
                  91-123-12345
                </a>
              </div>

              <div className="flex items-center gap-2">
                <AiOutlineTwitter className="text-primary" />
                <a
                  className="link link-hover"
                  href="https://twitter.com/talesfreeman"
                  target="_blank"
                  rel="noreferrer"
                >
                  @talesfreeman
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Form */}
        <section className="card bg-base-100 text-base-content shadow-md w-full md:w-2/3">
          <div className="card-body">
            <h1 className="card-title text-2xl md:text-3xl mb-4">
              {t("contact.form_title")}
            </h1>

            <form
              className="form-control gap-3"
              onSubmit={sendEmail}
              ref={formRef}
            >
              <div>
                <label className="label">
                  <span className="label-text font-semibold">
                    {t("contact.name_label")}
                  </span>
                </label>
                <input
                  className="input input-bordered w-full bg-base-100"
                  type="text"
                  placeholder={t("contact.name_placeholder")}
                  required
                  name="username"
                />
              </div>

              <div>
                <label className="label">
                  <span className="label-text font-semibold">
                    {t("contact.email_label")}
                  </span>
                </label>
                <input
                  className="input input-bordered w-full bg-base-100"
                  type="email"
                  placeholder={t("contact.email_placeholder")}
                  required
                  name="email"
                />
              </div>

              <div>
                <label className="label">
                  <span className="label-text font-semibold">
                    {t("contact.subject_label")}
                  </span>
                </label>
                <input
                  className="input input-bordered w-full bg-base-100"
                  type="text"
                  placeholder={t("contact.subject_placeholder")}
                  required
                  name="subject"
                />
              </div>

              <div>
                <label className="label">
                  <span className="label-text font-semibold">
                    {t("contact.message_label")}
                  </span>
                </label>
                <textarea
                  className="textarea textarea-bordered w-full bg-base-100"
                  rows={5}
                  required
                  name="message"
                />
              </div>

              <button
                className="btn btn-primary max-w-xs mt-4"
                type="submit"
                disabled={loading}
              >
                {loading
                  ? t("contact.sending")
                  : t("contact.send_message")}
              </button>
            </form>
          </div>
        </section>
      </main>
    </>
  );
};

export default Contact;
