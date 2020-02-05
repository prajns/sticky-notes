$(document).ready(function() {

    // Function to render note both from localstorage and creating new ones
    $.fn.renderNote = function(index, id, content){

        // Main note container
        const note = document.createElement("div");
        $(note).addClass("note--basic").attr("id", "n" + id).appendTo($(".board")).draggable({ 
            containment: "parent", 
            stack: ".note--basic", 
            cancel: ".note--basic__body", 
            stop: function() {
                // Get Rect of note
                let rect = note.getBoundingClientRect();

                // Update Rect in notesArray
                notesArray[index].rect = rect;

                // Update localstorage
                localStorage.setItem("notes", JSON.stringify(notesArray));
            }
        }).resizable( {
            minHeight: 240, 
            minWidth: 200,
            cancel: "footer", 
            stop: function() {
                // Get Rect of note
                let rect = note.getBoundingClientRect();

                // Update Rect in notesArray
                notesArray[index].rect = rect;

                // Update localstorage
                localStorage.setItem("notes", JSON.stringify(notesArray));
            }
        });

        // Header of note - Toolbar
        const noteHeader = document.createElement("div");
        $(noteHeader).addClass("note--basic__header").attr("id", "nht" + id).html(`
                <button class="ql-bold"></button>
                <button class="ql-italic"></button>
                <button class="ql-underline"></button>
                <button class="ql-strike"></button>

                <button class="ql-list" value="ordered"></button>
                <button class="ql-list" value="bullet"></button>          
        `).appendTo($(note));

        // Rest of header - Delete Button
        const noteHeaderClose = document.createElement("button");
        $(noteHeaderClose).addClass("btn--delete note--header__close").html("<i class='fas fa-times'></i>").appendTo($(noteHeader));

        // Delete note
        $(noteHeaderClose).click(function(){
            const res = confirm("Do you want to delete this note?");
            if (res == true) {
                // Remove note from DOM
                $(this).parent().parent().remove();

                // Remove note from notesArray
                notesArray.splice(index, 1)

                // Update localstorage
                localStorage.setItem("notes", JSON.stringify(notesArray));

                // Refresh notes count
                $("#notesCount").html(notesArray.length);
            }
        });

        // Body of note - container for Quill rich text editor
        const noteBody = document.createElement("div");
        $(noteBody).addClass("note--basic__body").attr("id", "nb" + id).html(content).appendTo($(note));

        // Init Quill
        const editor = new Quill(`#${$(noteBody).attr("id")}`, {
            modules: {
              toolbar: `#${$(noteHeader).attr("id")}`
            },
            theme: 'snow'
        });

        // Event on change note
        editor.on('text-change', function() {
            const tmp = editor.root.innerHTML;

            // Update notesArray with changes
            notesArray[index].content = tmp;

            // Update localstorage
            localStorage.setItem("notes", JSON.stringify(notesArray));
        });
        
        return note;
    }

    // Retrive notesArray from localstorage
    let notesArray = JSON.parse(localStorage.getItem("notes") || "[]");
    $("#notesCount").html(notesArray.length);

    // Display all notes from notesArray in DOM
    $.each(notesArray, function(index, value) {
        const note = $.fn.renderNote(index, value.id, value.content);
        $(note).css({ "left": notesArray[index].rect.left, "top": notesArray[index].rect.top, "width": notesArray[index].rect.width, "height": notesArray[index].rect.height });
    });

    // Create new note after button click
    $(".btn--add").click(function() {

        // Create new ID based on date
        const idBase = Date.now();
        $.fn.renderNote(notesArray.length, idBase, "");

        // Add created note to notesArray
        notesArray.push({id: idBase, content: "<p><br></p>", rect: {x: 50, y: 50, width: 202, height: 242, top: 50, right: 0, bottom: 0, left: 50}});

        // Refresh notes count
        $("#notesCount").html(notesArray.length);

        // Update localstorage
        localStorage.setItem("notes", JSON.stringify(notesArray));

    });

});