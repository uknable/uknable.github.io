$(document).ready(() => {
    $("img").on("click", (element) => {
        var filename = element.target.src;
        $("#modal-body-image").attr("src", filename);
    })
});