/*
 * HealthCore: patient enquiry form (specs/002-application-form).
 * Validation rules, step navigation and simulated submission.
 * Vanilla JS, no dependencies. The form never sends or stores data.
 */
(function () {
  'use strict';

  // ---------------------------------------------------------------- data

  var STEPS = {
    1: ['first_name', 'last_name', 'date_of_birth', 'email', 'phone', 'preferred_language'],
    2: ['preferred_clinic', 'preferred_date', 'preferred_time', 'service_type', 'new_patient', 'patient_id'],
    3: ['has_insurance', 'insurance_provider', 'insurance_member_id'],
    4: ['health_concern', 'contact_consent'],
  };
  var TOTAL_STEPS = 4;
  var RADIO_FIELDS = ['new_patient', 'has_insurance'];

  var OPTIONS = {
    preferred_language: ['English', 'Spanish'],
    preferred_clinic: [
      'HealthCore Austin Central',
      'HealthCore Austin North',
      'HealthCore San Antonio',
      'HealthCore Miami',
      'HealthCore Orlando',
      'HealthCore Atlanta',
    ],
    preferred_time: ['Morning', 'Afternoon', 'Evening'],
    service_type: [
      'Primary Care',
      'Chronic Disease Management',
      'Specialist Consultation',
      'Preventive Health',
      "Women's Health",
      'Paediatric Care',
      'Mental Health',
    ],
    new_patient: ['Yes', 'No'],
    has_insurance: ['Yes', 'No'],
  };

  // Weekday closing hour (24 h) per clinic, from the Locations table of the briefing.
  var CLOSING_HOUR = {
    'HealthCore Austin Central': 20,
    'HealthCore Austin North': 19,
    'HealthCore San Antonio': 18,
    'HealthCore Miami': 20,
    'HealthCore Orlando': 18,
    'HealthCore Atlanta': 19,
  };

  var HEALTH_CONCERN_MIN = 20;
  var HEALTH_CONCERN_MAX = 500;

  // Messages: the ones for each field come verbatim from BRIEFING.en.md / BRIEFING.md.
  // Keys marked "extra" are not in the briefing (design.md section 5).
  var MESSAGES = {
    en: {
      first_name: 'First name must contain only letters and be at least 2 characters',
      last_name: 'Last name must contain only letters and be at least 2 characters',
      date_of_birth: 'Enter a valid date of birth. Patient must be between 0 and 120 years old',
      email: 'Enter a valid email address (example: name@provider.com)',
      phone: 'Phone must include a country code (example: +1 305 555 0191)',
      preferred_language: 'Select your preferred language',
      preferred_clinic: 'Select the clinic you would like to visit',
      preferred_date: 'Select a date at least 1 business day from today and no more than 60 days ahead',
      preferred_time: 'Select your preferred time of day',
      service_type: 'Select the type of care you are looking for',
      service_type_paediatric: 'Paediatric Care is available for patients under 18. Please check the date of birth or select a different service.',
      new_patient: 'Please indicate whether this is your first visit to HealthCore',
      has_insurance: 'Please indicate whether you have health insurance',
      insurance_provider: 'Please enter your insurance provider name',
      insurance_member_id: 'Member ID must be between 6 and 20 alphanumeric characters',
      health_concern: 'Please describe your health concern in at least 20 characters ({n} characters remaining)',
      contact_consent: 'You must consent to being contacted before submitting this form',
      // extra
      patient_id: 'Patient ID must start with HC- followed by 6 letters or numbers (example: HC-A3F291)',
      health_concern_max: 'Please keep your health concern to 500 characters or fewer',
      time_clinic_warning: '{clinic} closes at {hour} on weekdays, so evening appointments may not be available. You can still send your enquiry.',
      error_prefix: 'Error:',
      warning_prefix: 'Warning:',
      step_status: 'Step {n} of {total}',
    },
    es: {
      first_name: 'El nombre debe contener solo letras y tener al menos 2 caracteres',
      last_name: 'El apellido debe contener solo letras y tener al menos 2 caracteres',
      date_of_birth: 'Ingresa una fecha de nacimiento válida. El paciente debe tener entre 0 y 120 años',
      email: 'Ingresa un correo electrónico válido (ejemplo: nombre@proveedor.com)',
      phone: 'El teléfono debe incluir un código de país (ejemplo: +1 305 555 0191)',
      preferred_language: 'Selecciona tu idioma preferido',
      preferred_clinic: 'Selecciona la clínica que te gustaría visitar',
      preferred_date: 'Selecciona una fecha de al menos 1 día hábil desde hoy y no más de 60 días hacia adelante',
      preferred_time: 'Selecciona tu franja horaria preferida',
      service_type: 'Selecciona el tipo de atención que estás buscando',
      service_type_paediatric: 'Paediatric Care está disponible para pacientes menores de 18 años. Revisa la fecha de nacimiento o selecciona un servicio diferente.',
      new_patient: 'Indica si esta es tu primera visita a HealthCore',
      has_insurance: 'Indica si tienes seguro médico',
      insurance_provider: 'Ingresa el nombre de tu aseguradora',
      insurance_member_id: 'El ID de afiliado debe tener entre 6 y 20 caracteres alfanuméricos',
      health_concern: 'Describe tu consulta médica en al menos 20 caracteres (faltan {n} caracteres)',
      contact_consent: 'Debes dar tu consentimiento para ser contactado antes de enviar este formulario',
      // extra
      patient_id: 'El Patient ID debe empezar por HC- seguido de 6 letras o números (ejemplo: HC-A3F291)',
      health_concern_max: 'Describe tu consulta médica en 500 caracteres o menos',
      time_clinic_warning: '{clinic} cierra a las {hour} entre semana, así que puede que no haya citas por la tarde-noche. Puedes enviar tu consulta igualmente.',
      error_prefix: 'Error:',
      warning_prefix: 'Aviso:',
      step_status: 'Paso {n} de {total}',
    },
  };

  // --------------------------------------------------------------- dates
  // Dates are plain {y, m, d} objects in local time. `new Date('YYYY-MM-DD')`
  // is never used: it is parsed as UTC and can shift the day.

  function getToday() {
    var now = new Date();
    return { y: now.getFullYear(), m: now.getMonth() + 1, d: now.getDate() };
  }

  function dateKey(date) {
    return date.y * 10000 + date.m * 100 + date.d;
  }

  function parseDate(str) {
    var match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(str || '').trim());
    if (!match) return null;
    var y = Number(match[1]);
    var m = Number(match[2]);
    var d = Number(match[3]);
    var check = new Date(y, m - 1, d);
    if (check.getFullYear() !== y || check.getMonth() !== m - 1 || check.getDate() !== d) return null;
    return { y: y, m: m, d: d };
  }

  function addDays(date, days) {
    var next = new Date(date.y, date.m - 1, date.d + days);
    return { y: next.getFullYear(), m: next.getMonth() + 1, d: next.getDate() };
  }

  function dayOfWeek(date) {
    return new Date(date.y, date.m - 1, date.d).getDay(); // 0 = Sunday
  }

  function ageOn(birth, today) {
    var age = today.y - birth.y;
    if (today.m < birth.m || (today.m === birth.m && today.d < birth.d)) age -= 1;
    return age;
  }

  // First business day (Mon-Fri) strictly after today.
  function nextBusinessDay(today) {
    var next = addDays(today, 1);
    while (dayOfWeek(next) === 0 || dayOfWeek(next) === 6) next = addDays(next, 1);
    return next;
  }

  function maxPreferredDate(today) {
    return addDays(today, 60);
  }

  function formatDate(date) {
    function pad(n) { return n < 10 ? '0' + n : String(n); }
    return date.y + '-' + pad(date.m) + '-' + pad(date.d);
  }

  // --------------------------------------------------------------- rules
  // A rule returns null (valid) or { key, params }.

  var NAME_PATTERN = /^[\p{L}\p{M}]+(?:[ '’-][\p{L}\p{M}]+)*$/u;
  var EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  var PHONE_PATTERN = /^\+[1-9]\d{7,14}$/;
  var MEMBER_ID_PATTERN = /^[A-Za-z0-9]{6,20}$/;
  var PATIENT_ID_PATTERN = /^HC-[A-Za-z0-9]{6}$/i;

  function text(values, name) {
    return String(values[name] == null ? '' : values[name]).trim();
  }

  function fail(key, params) {
    return { key: key, params: params || {} };
  }

  function nameRule(name) {
    return function (values) {
      var value = text(values, name);
      return value.length >= 2 && value.length <= 50 && NAME_PATTERN.test(value) ? null : fail(name);
    };
  }

  function choiceRule(name) {
    return function (values) {
      return OPTIONS[name].indexOf(values[name]) !== -1 ? null : fail(name);
    };
  }

  var RULES = {
    first_name: nameRule('first_name'),
    last_name: nameRule('last_name'),

    date_of_birth: function (values, today) {
      var birth = parseDate(values.date_of_birth);
      if (!birth || dateKey(birth) > dateKey(today)) return fail('date_of_birth');
      return ageOn(birth, today) <= 120 ? null : fail('date_of_birth');
    },

    email: function (values) {
      var value = text(values, 'email');
      return value.length <= 254 && EMAIL_PATTERN.test(value) ? null : fail('email');
    },

    phone: function (values) {
      var digits = text(values, 'phone').replace(/[\s\-.()]/g, '');
      return PHONE_PATTERN.test(digits) ? null : fail('phone');
    },

    preferred_language: choiceRule('preferred_language'),
    preferred_clinic: choiceRule('preferred_clinic'),
    preferred_time: choiceRule('preferred_time'),

    preferred_date: function (values, today) {
      var date = parseDate(values.preferred_date);
      if (!date) return fail('preferred_date');
      var key = dateKey(date);
      return key >= dateKey(nextBusinessDay(today)) && key <= dateKey(maxPreferredDate(today))
        ? null
        : fail('preferred_date');
    },

    service_type: function (values, today) {
      if (OPTIONS.service_type.indexOf(values.service_type) === -1) return fail('service_type');
      if (values.service_type === 'Paediatric Care') {
        var birth = parseDate(values.date_of_birth);
        // Without a valid date of birth the rule is skipped: that field shows its own error.
        if (birth && dateKey(birth) <= dateKey(today) && ageOn(birth, today) >= 18) {
          return fail('service_type_paediatric');
        }
      }
      return null;
    },

    new_patient: choiceRule('new_patient'),

    patient_id: function (values) {
      var value = text(values, 'patient_id');
      return value === '' || PATIENT_ID_PATTERN.test(value) ? null : fail('patient_id');
    },

    has_insurance: choiceRule('has_insurance'),

    insurance_provider: function (values) {
      var value = text(values, 'insurance_provider');
      return value.length >= 1 && value.length <= 100 ? null : fail('insurance_provider');
    },

    insurance_member_id: function (values) {
      return MEMBER_ID_PATTERN.test(text(values, 'insurance_member_id')) ? null : fail('insurance_member_id');
    },

    health_concern: function (values) {
      var length = text(values, 'health_concern').length;
      if (length < HEALTH_CONCERN_MIN) return fail('health_concern', { n: HEALTH_CONCERN_MIN - length });
      if (length > HEALTH_CONCERN_MAX) return fail('health_concern_max');
      return null;
    },

    contact_consent: function (values) {
      return values.contact_consent ? null : fail('contact_consent');
    },
  };

  // Conditional fields only apply when their trigger has the right value.
  function isApplicable(name, values) {
    if (name === 'insurance_provider' || name === 'insurance_member_id') return values.has_insurance === 'Yes';
    if (name === 'patient_id') return values.new_patient === 'No';
    return true;
  }

  function validateField(name, values, today) {
    if (!RULES[name] || !isApplicable(name, values)) return null;
    return RULES[name](values, today || getToday());
  }

  // Returns { field: error } for every applicable field of the step that fails.
  function validateStep(step, values, today) {
    var errors = {};
    STEPS[step].forEach(function (name) {
      var error = validateField(name, values, today);
      if (error) errors[name] = error;
    });
    return errors;
  }

  // Non-blocking warning: Evening slot with a clinic that closes before 8pm on weekdays.
  function getTimeClinicWarning(values) {
    if (values.preferred_time !== 'Evening') return null;
    var closing = CLOSING_HOUR[values.preferred_clinic];
    if (!closing || closing >= 20) return null;
    return { key: 'time_clinic_warning', params: { clinic: values.preferred_clinic, hour: (closing - 12) + 'pm' } };
  }

  function formatMessage(lang, key, params) {
    var template = (MESSAGES[lang] || MESSAGES.en)[key] || key;
    return template.replace(/\{(\w+)\}/g, function (whole, name) {
      return params && params[name] != null ? params[name] : whole;
    });
  }

  var api = {
    STEPS: STEPS,
    MESSAGES: MESSAGES,
    OPTIONS: OPTIONS,
    CLOSING_HOUR: CLOSING_HOUR,
    getToday: getToday,
    parseDate: parseDate,
    ageOn: ageOn,
    addDays: addDays,
    nextBusinessDay: nextBusinessDay,
    maxPreferredDate: maxPreferredDate,
    formatDate: formatDate,
    isApplicable: isApplicable,
    validateField: validateField,
    validateStep: validateStep,
    getTimeClinicWarning: getTimeClinicWarning,
    formatMessage: formatMessage,
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  if (typeof document === 'undefined') return;

  // ----------------------------------------------------------- interface

  var form = document.getElementById('application-form');
  if (!form) return;

  var lang = document.documentElement.lang.toLowerCase().indexOf('es') === 0 ? 'es' : 'en';
  var currentStep = 1;
  var touched = {};

  var statusEl = document.getElementById('step-status');
  var successEl = document.getElementById('success');
  var backBtn = document.getElementById('btn-back');
  var nextBtn = document.getElementById('btn-next');
  var submitBtn = document.getElementById('btn-submit');
  var resetBtn = document.getElementById('btn-reset');
  var counterEl = document.getElementById('health_concern-counter');

  function msg(key, params) {
    return formatMessage(lang, key, params);
  }

  function allFields() {
    return Object.keys(RULES);
  }

  function readValues() {
    var values = {};
    allFields().forEach(function (name) {
      if (RADIO_FIELDS.indexOf(name) !== -1) {
        var checked = form.querySelector('input[name="' + name + '"]:checked');
        values[name] = checked ? checked.value : '';
      } else if (name === 'contact_consent') {
        values[name] = form.elements[name].checked ? 'on' : '';
      } else {
        values[name] = form.elements[name].value;
      }
    });
    return values;
  }

  function control(name) {
    return document.getElementById(name);
  }

  function focusTarget(name) {
    if (RADIO_FIELDS.indexOf(name) !== -1) return form.querySelector('input[name="' + name + '"]');
    return control(name);
  }

  function setMessage(el, prefixKey, message) {
    el.querySelector('[data-text]').textContent = msg(prefixKey) + ' ' + message;
    el.hidden = false;
  }

  function showError(name, error) {
    var el = document.getElementById(name + '-error');
    control(name).setAttribute('aria-invalid', 'true');
    if (el) setMessage(el, 'error_prefix', msg(error.key, error.params));
  }

  function clearError(name) {
    var el = document.getElementById(name + '-error');
    control(name).removeAttribute('aria-invalid');
    if (el) {
      el.hidden = true;
      el.querySelector('[data-text]').textContent = '';
    }
  }

  function updateWarning(values) {
    var el = document.getElementById('preferred_time-warning');
    if (!el) return;
    var warning = getTimeClinicWarning(values);
    if (warning) {
      setMessage(el, 'warning_prefix', msg(warning.key, warning.params));
    } else {
      el.hidden = true;
      el.querySelector('[data-text]').textContent = '';
    }
  }

  // Validates one field and shows or clears its error. Returns true when valid.
  function checkField(name, values) {
    values = values || readValues();
    var error = validateField(name, values);
    if (error) showError(name, error);
    else clearError(name);
    if (name === 'preferred_time' || name === 'preferred_clinic') updateWarning(values);
    return !error;
  }

  function updateCounter() {
    if (!counterEl) return;
    counterEl.textContent = form.elements.health_concern.value.length + ' / ' + HEALTH_CONCERN_MAX;
  }

  function setRequired(name, required) {
    var el = control(name);
    if (required) el.setAttribute('required', '');
    else el.removeAttribute('required');
  }

  function updateConditionals() {
    var values = readValues();

    var insurance = document.getElementById('insurance-fields');
    var showInsurance = values.has_insurance === 'Yes';
    insurance.hidden = !showInsurance;
    setRequired('insurance_provider', showInsurance);
    setRequired('insurance_member_id', showInsurance);
    if (!showInsurance) {
      clearError('insurance_provider');
      clearError('insurance_member_id');
    }

    var patientId = document.getElementById('patient-id-field');
    var showPatientId = values.new_patient === 'No';
    patientId.hidden = !showPatientId;
    if (!showPatientId) clearError('patient_id');
  }

  function showStep(step, focus) {
    currentStep = step;
    var fieldsets = form.querySelectorAll('fieldset[data-step]');
    Array.prototype.forEach.call(fieldsets, function (fieldset) {
      fieldset.hidden = Number(fieldset.getAttribute('data-step')) !== step;
    });
    Array.prototype.forEach.call(form.querySelectorAll('[data-progress]'), function (segment) {
      var done = Number(segment.getAttribute('data-progress')) <= step;
      segment.classList.toggle('bg-primary', done);
      segment.classList.toggle('bg-primary-tint', !done);
    });
    statusEl.textContent = msg('step_status', { n: step, total: TOTAL_STEPS });
    backBtn.hidden = step === 1;
    nextBtn.hidden = step === TOTAL_STEPS;
    submitBtn.hidden = step !== TOTAL_STEPS;
    resetBtn.hidden = step !== TOTAL_STEPS;
    if (focus) {
      var title = document.getElementById('step-' + step + '-title');
      if (title) title.focus();
    }
  }

  // Validates every applicable field of a step. Returns the first invalid field name or null.
  function checkStep(step) {
    var values = readValues();
    var first = null;
    STEPS[step].forEach(function (name) {
      if (!isApplicable(name, values)) return;
      touched[name] = true;
      if (!checkField(name, values) && !first) first = name;
    });
    return first;
  }

  function goNext() {
    var invalid = checkStep(currentStep);
    if (invalid) {
      focusTarget(invalid).focus();
      return;
    }
    if (currentStep < TOTAL_STEPS) showStep(currentStep + 1, true);
  }

  function goBack() {
    if (currentStep > 1) showStep(currentStep - 1, true);
  }

  function onSubmit(event) {
    event.preventDefault();
    var firstStep = null;
    var firstField = null;
    for (var step = 1; step <= TOTAL_STEPS; step += 1) {
      var invalid = checkStep(step);
      if (invalid && !firstStep) {
        firstStep = step;
        firstField = invalid;
      }
    }
    if (firstStep) {
      showStep(firstStep, false);
      focusTarget(firstField).focus();
      return;
    }
    // Simulated submission: nothing is sent or stored (spec R27).
    form.hidden = true;
    successEl.hidden = false;
    successEl.focus();
  }

  function onReset() {
    // Runs after the native reset has emptied the fields.
    setTimeout(function () {
      // Move focus first: leaving a field would otherwise validate it again (focusout).
      showStep(1, true);
      allFields().forEach(clearError);
      touched = {};
      updateConditionals();
      updateWarning(readValues());
      updateCounter();
    }, 0);
  }

  // Live validation (spec R22): text fields on blur and while typing once touched or invalid;
  // selects, radios and checkboxes on change.
  function onFieldEvent(event) {
    var el = event.target;
    var name = el.name;
    if (!name || !RULES[name]) return;
    var type = event.type;
    var isToggle = el.type === 'radio' || el.type === 'checkbox';
    var isChoice = isToggle || el.tagName === 'SELECT';

    if (type === 'focusout') {
      // Leaving one radio for its sibling is not an error: toggles are checked on change.
      if (isToggle) return;
      touched[name] = true;
      checkField(name);
      return;
    }

    if (type === 'input') {
      if (name === 'health_concern') updateCounter();
      if (isChoice) return; // selects, radios and checkboxes are handled by "change"
      if (touched[name] || el.getAttribute('aria-invalid') === 'true') checkField(name);
    } else if (type === 'change') {
      if (!isChoice) return; // text inputs are handled by "input" and "focusout"
      touched[name] = true;
      checkField(name);
    }

    if (name === 'has_insurance' || name === 'new_patient') updateConditionals();
    // Cross-field rule: the date of birth decides whether Paediatric Care is allowed.
    if (name === 'date_of_birth' && touched.service_type) checkField('service_type');
  }

  function onKeydown(event) {
    if (event.key !== 'Enter' || currentStep === TOTAL_STEPS) return;
    var tag = event.target.tagName;
    if (tag === 'TEXTAREA' || tag === 'BUTTON' || tag === 'A') return;
    event.preventDefault();
    goNext();
  }

  function setDateLimits() {
    var today = getToday();
    var dob = control('date_of_birth');
    dob.setAttribute('max', formatDate(today));
    dob.setAttribute('min', formatDate(addDays({ y: today.y - 120, m: today.m, d: today.d }, 0)));
    var preferred = control('preferred_date');
    preferred.setAttribute('min', formatDate(nextBusinessDay(today)));
    preferred.setAttribute('max', formatDate(maxPreferredDate(today)));
  }

  form.addEventListener('focusout', onFieldEvent);
  form.addEventListener('input', onFieldEvent);
  form.addEventListener('change', onFieldEvent);
  form.addEventListener('keydown', onKeydown);
  form.addEventListener('submit', onSubmit);
  form.addEventListener('reset', onReset);
  nextBtn.addEventListener('click', goNext);
  backBtn.addEventListener('click', goBack);

  setDateLimits();
  updateConditionals();
  updateCounter();
  showStep(1, false);
})();
