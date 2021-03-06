$(document).ready(function () {
    var matrixData = formatMatrix($('#rawMatrix').val());
    $('#currentMatrix').text(matrixData);
});

function formatMatrix(matrix) {
    var found = matrix.match(/\[((EPS|\d+(\.\d+)?)\,?)+\]/gm);
    var final = '';
    $.each(found, function (index, value) {
        final = final + value.split(/[ ]+/).join(',') + '\n'
    });
    return final;
}

$("#saveButton").click(function () {
    var expo = $("#expoValue option:selected").val();
    var matrixInput = getMatrixInput();
    if (checkInput(matrixInput)) {
        var matrixJson = finaliseMatrix(matrixInput);
        var jsonData = [{ expo }, { matrixJson }];
        postJson(JSON.stringify(jsonData));
    } else {
        window.alert("Please ensure the input matrix is valid and matches the size of the network matrix");
    }
});

function getMatrixInput() {
    var matrix = $.trim($('#matrixInput').val());
    var regex = /\[((\d+(\.+\d+)?)\,?)+\]/gm;
    return matrix.match(regex);
}

function checkInput(matches) {
    var rowCount = matches.length;
    var regex = /(\d+(\.\d+)?)/gm;
    var matrixSize = getSizeOfMatrix();
    for (y = 0; y < rowCount; y++) {
        var rowMatches = matches[y].match(regex);
        if (rowMatches.length !== rowCount || rowMatches.length !== matrixSize) {
            return false;
        }
    }
    return true;
}

function getSizeOfMatrix() {
    var matrix = $('#matrixInput').val();
    var regex = /\[((\d+(\.\d+)?)\,?)+\]/gm;
    var matches = matrix.match(regex);
    return matches.length;
}

function finaliseMatrix(matrixData) {
    var final = new Array();
    final = {};
    for (var x = 0; x < matrixData.length; x++) {
        var newRow = matrixData[x].replace("EPS", "0");
        final[x] = JSON.parse(newRow);
    }
    return final;
}

function postJson(json) {
    var getUrl = window.location.href;
    $.ajax({
        url: getUrl,
        type: "POST",
        dataType: 'text',
        data: json,
        success: function (result) {
            console.log(result);
        },
        error: function (xhr, status, error) {
            console.log(error);
        }
    });
}