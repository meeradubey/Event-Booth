$(document).ready(function() {
  
    //When submit button is clicked
    $("#btnSubmit").on("click", insertRecipient);
  
    //When a delete X is clicked
    $(document).on("click", "button.delete", deleteRecipient);
  
  
    // Our initial recipients array
    var recipients = [];
  
    // Getting recipients from database when page loads
    getRecipients();
  
    // This function resets the recipients displayed with new recipients from the database
    function initializeList() {
      $("#recipients-list").empty();
      const recipientsToAdd = [];
      recipients.forEach(element => {
        recipientsToAdd.push(createNewList(element));      
      });
      $("#recipients-list").append(recipientsToAdd);
      $("#invite-count").text(recipientsToAdd.length);
      console.log("In initializeList(). recipientsToAdd: ", recipientsToAdd.length);
    }
  
    // This function grabs recipients from the database and updates the view
    function getRecipients() {
      $.get("/api/recipients", function(data) {
        recipients = data;
        console.log("recipients arr from db: ", recipients);
        initializeList();
      });
    }
  
    // This function deletes a Recipient when the user clicks the delete button
    function deleteRecipient(event) {
      event.stopPropagation();
      const id = $(this).data("id");
      $.ajax({
        method: "DELETE",
        url: "/api/recipients/" + id
      }).then(getRecipients);
    }
  
    // This function constructs a recipient list item
    function createNewList(recipient) {
      var $newRecipient = $(
        [
          "<li>",
          recipient.invite_name,
          "<br>",
          "<span>",
          recipient.invite_email,
          "</span>",
          "<button class='delete btn btn-danger'>x</button>",
          "</li>",
          "<br>"
        ].join("")
      );
  
      $newRecipient.find("button.delete").data("id", recipient.id);
      $newRecipient.data("recipient", recipient);
  
      return $newRecipient;
    }
  
    // This function inserts a new recipient into our database and then updates the view
    function insertRecipient(event) {
      event.preventDefault();
      const newRecipient = {
        invite_name: $("#new-recipient").val().trim(),
        invite_email: $("#new-email").val().trim(),
        event_id: $("#event_id").val()
      };
  
      console.log("newRecipient: ", newRecipient);
  
      $.post("/api/recipients", newRecipient, getRecipients);
      $("#new-recipient").val("");
      $("#new-email").val("");
  
    }
  });
  