$('#rsvpForm').submit((event) => {
  event.preventDefault();

  $('#rsvpSubmitButton').attr('disabled', true);
  $.ajax(
    'api/rsvp',
    {
      method: 'POST',
      data: $('#rsvpForm').serialize(),
    },
  ).done(() => {
    $('#rsvpSuccessFlashContainer').css('max-height', '500px');
  }).fail((error) => {
    $('#rsvpFailureFlashContainer').css('max-height', '500px');
    // eslint-disable-next-line no-console
    console.error(error);
  }).always(() => {
    $('#rsvpSubmitButton').attr('disabled', false);
  });
});
