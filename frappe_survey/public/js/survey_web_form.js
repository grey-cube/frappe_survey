const load_survey = function (survey_name) {
  $(".web-form-container").toggle(false);
  $('<div id="surveyElement"></div>').appendTo($(".page_content"));
  frappe
    .call({
      method: "frappe.client.get",
      args: {
        doctype: "Survey",
        name: frappe.web_form.title,
      },
    })
    .then((r) => {
      build_survey(r.message);
      const survey = new Survey.Model(frappe.survey_json);
      survey.applyTheme(frappe.theme_json);
      survey.onComplete.add((sender, options) => {
        submit_response(sender.getAllValues());
      });
      // initialize survey
      $("#surveyElement").Survey({ model: survey });
    });
};

const build_survey = function (data) {
  // transform frappe doc to survey model
  frappe.survey_json = JSON.parse(data.survey_json.replaceAll("\n", ""));
  frappe.theme_json = data.theme_json
    ? JSON.parse(data.theme_json)
    : {
        themeName: "plain",
        colorPalette: "dark",
        isPanelless: true,
      };
};

const submit_response = function (data) {
  // Save
  window.saving = true;
  frappe.form_dirty = false;

  let args = {
    survey: frappe.web_form.title,
    response_json: JSON.stringify(data),
  };

  console.log(args);

  frappe.call({
    type: "POST",
    method: "frappe.website.doctype.web_form.web_form.accept",
    args: {
      web_form: frappe.web_form.name,
      data: args,
    },
    callback: (response) => {
      if (!response.exc) {
        // Success
        frappe.show_alert(__("Your response has been submitted successfully."));
      }
    },
    always: function () {
      window.saving = false;
    },
  });
};
