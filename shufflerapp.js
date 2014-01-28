;
(function() {

  function ActionCard(id, prettyName, price, types) {
    return {
      id: id,
      prettyName: prettyName,
      price: price,
      types: types || []
    }
  };

  var existingActionCards = [
    new ActionCard ('cellarCard', 'Cellar', 2),
    new ActionCard ('chapelCard', 'Chapel', 2),
    new ActionCard ('moatCard',   'Moat',   2, ['reaction']),
    new ActionCard ('witchCard',  'Witch',  5, ['attack'])
  ];

  var possibleCards = _.cloneDeep(existingActionCards);

  function updateCardList(cards, list) {
    list.empty();
    _.forEach(cards, function (card) {
      list.append('<li>' + card.prettyName + '</li>');
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

  $('.preference-input').click(updateShufflePreferences);
  $('#cardPriceRangeSelector').on('slidechange', updateShufflePreferences);

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

  updateShufflePreferences();

})();