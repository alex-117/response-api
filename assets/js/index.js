let zip9,
    address,
    city,
    country,
    state,
    searchResult,
    searchResults = [];
/**
 * API call to get zip9 value then pass it into getProfitGrade()
 */
function getZip() {
    //ajax request to retrieve zip9 data
    console.log('inside searchApi');
    $.ajax({
        url: "https://geo.idbcore.com/address/verify?city=" + city + "&country=" + country + "&state=" + state + "&street=" + address,
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Token " + "ce80aab1c5fdab62fd4afd2a66632f2bc7dcde31");
        },
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json',
        processData: false,
        data: '{"foo":"bar"}',
        error: function () {
            console.log("Cannot get response");
        },
        success: function (response) {
            console.log(response);
            let responseData = response;
            zip9 = response.postal_code;
            //Second ajax request using zip9 to retrieve profit_grade
            getProfitGrade(zip9, responseData);
        }
    });
};


/**
 * Retrieve profit_grade once getZip() returns zip9 code 
 */
function getProfitGrade(zip9, data) {
    $.ajax({
        url: "https://geo.idbcore.com/registration_score?zip_code=" + zip9,
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Token " + "ce80aab1c5fdab62fd4afd2a66632f2bc7dcde31");
        },
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json',
        processData: false,
        data: '{"foo":"bar"}',
        error: function () {
            console.log("Cannot get response");
        },
        success: function (response) {
            console.log('ln 56: ',response);
            //push to searchResults arr
            let resultsData = {
                street: data.line1,
                city: data.city,
                country: data.country,
                zip: data.normalized_postal_code,
                profit_grade: response.profit_grade
            }
            searchResults.push(resultsData);
            loopSearchResults();
        }
    });
}

function loopSearchResults() {
    $('.table-body').empty();
    for (let i = 0; i < searchResults.length; i++) {
        let address = searchResults[i].street + ", " + searchResults[i].city + ", " + searchResults[i].country + " " + searchResults[i].zip;
        let trashBtn = '<i class="ion-ios-trash-outline"></i>';
        let tableRow = '<th scope="row">' + (i + 1) + '</th><td class="address">' + address + '</td><td class="profit-grade">' + searchResults[i].profit_grade + '</td><td class="trash-button">' + trashBtn + '</td></th>';
        $('.table-body').prepend("<tr>" + tableRow + "</tr>");
    }
}

$(document).on('click', '.trash-button', (e) => {
    e.preventDefault();
    let test = e.target.closest('tr');
    searchResults.splice(0, 1);
    loopSearchResults();
});

$(document).ready(() => {
    $('#form-submit').on('click', (e) => {
        e.preventDefault();
        address = $('#address-input').val().trim();
        city = $('#city-input').val().trim();
        country = $('#country-input').val().trim();
        state = $('#state-input').val().trim();
        getZip(address, city, country, state);
        $('#form').find('input:text').val('');
    });
});