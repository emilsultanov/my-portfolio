$(document).ready(function () {

   // $('.projects_grid').isotope({
   //    itemSelector: '.item'
   // })



   $('.projects_list .projects_item').click(function (e) {

      $(this).siblings().removeClass('projects_activeItem');
      $(this).addClass('projects_activeItem');

      var item = $(this).attr('data-filter');
      $('.projects .projects_grid').isotope({
         filter: item
      });

      return false;
   });
   $('.projects_list .projects_item').eq(0).trigger('click')
});