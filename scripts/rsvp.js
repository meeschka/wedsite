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
    $('#rsvpSubmitButton').attr('disabled', false);
  });
});

$('#addGuestButton').click((event) => {
  event.preventDefault();

  $('#additionalGuests').append(`
    <label class="form-label">
      <input type="text" class="form-control" name="guestName" placeholder="Other guest's name" required>
    </label>
  `);
});

$('#addGuestButton').attr('href', '');
