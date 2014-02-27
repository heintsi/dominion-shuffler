;
(function() {

  var existingActionCards = [];
  var possibleCards = [];

  function updateCardList(cards, list) {
    list.empty();
    _.forEach(cards, function (card) {
      list.append('<li class="card">' + card.name + '</li>');
    });
  }

  function shuffle () {
    updateCardList(_.sample(possibleCards, 10), $('#selectedCardsList'));
  };

  function renderPossibleCards() {
    updateCardList(possibleCards, $('#possibleCardsList'))
  };

  var shuffleMatchers = {
    matchesAttackPreference: function (card) { 
      return $('input[name=togglePreferenceAttackCards]').is(':checked') || !_.contains(card.types, 'attack');
    },
    matchesReactionPreference: function (card) { 
      return $('input[name=togglePreferenceReactionCards]').is(':checked') || !_.contains(card.types, 'reaction');
    },
    isInPriceRange: function (card) {
      return card.price >= $('#cardPriceRangeSelector').slider('values', 0) && card.price <= $('#cardPriceRangeSelector').slider('values', 1);
    }
  };

  function cardPreferenceMatcher(card, key, collection) {
    return _.every(shuffleMatchers, function(matcher) {
      return matcher(card);
    });
  };

  function updateShufflePreferences() {
    possibleCards = _.filter(existingActionCards, cardPreferenceMatcher);
    renderPossibleCards();
  };

  $('#cardPriceRangeSelector').on('slidechange', updateShufflePreferences);

  $('.preference-input').click(updateShufflePreferences);
  $('#shuffleButton').click(shuffle);

  $('#cardPriceRangeSelector').slider({
    range: true,
    min: 0,
    max: 6,
    values: [0,5],
    slide: function (event, ui) {
      $('#cardPriceRange').text('Card price range: ' + ui.values[0] + ' - ' + ui.values[1]);
    }
  });

  $.getJSON('/dominion-cards.json', function(data) {
    existingActionCards = data;
    possibleCards = _.cloneDeep(existingActionCards);
    updateShufflePreferences();
  });


})();