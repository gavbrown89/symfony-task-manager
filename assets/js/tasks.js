import $ from 'jquery';

let currentPage = 1;
let totalPages = 1;
let totalTasks = 0;
let tasksPerPage = 5;
let orderBy = 'desc';

// fetch tasks via Ajax
function loadTasks(page = 1) {
    $.ajax({
        url: `/tasks?page=${page}&&order=${orderBy}`,
        method: 'GET',
        dataType: 'json',
        success: function (response) {
            currentPage = response.page;
            totalPages = response.totalPages;
            totalTasks = response.totalTasks;

            updatePaginationText();
            updatePaginationBtns();
            render(response.tasks);
        },
        error: function (error) {
            console.log('Error: ', error);
        }
    });
}

// Display tasks in list
function render(tasks) {
    let list = $('#task-list');

    list.empty();

    tasks.forEach(task => {
        list.append(`
            <li class="flex items-center justify-between gap-x-6 py-5">
                <div class="min-w-0">
                    <div class="flex items-start gap-x-3">
                        <p class="text-sm/6 font-semibold text-gray-900">${task.title}</p>
                        <p class="task-status mt-0.5 whitespace-nowrap rounded-md px-1.5 py-0.5 text-xs font-medium ring-1 ring-inset ${task.is_done ? 'bg-green-50 text-green-700 ring-green-600/20' : 'bg-gray-50 text-gray-600 ring-gray-500/10'}">${task.is_done ? 'Complete' : 'Pending'}</p>
                    </div>
                </div>
                <div class="flex flex-none items-center gap-x-4">
                    
                    <button 
                        type="button" 
                        class="toggle-task relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 ${task.is_done ? 'bg-indigo-600' : 'bg-gray-200'}" 
                        data-id="${task.id}"
                        role="switch" 
                        aria-checked="${task.is_done ? 'true' : 'false'}">
                            <span class="sr-only">Toggle</span>
                            <span aria-hidden="true" class="pointer-events-none inline-block size-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${task.is_done ? 'translate-x-0' : 'translate-x-5'}"></span>
                    </button>
                
                    <button
                        type="button"
                        class="delete-task rounded-md bg-red-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm ring-1 ring-inset hover:bg-red-500 sm:block"
                        data-id="${task.id}"
                        >Delete</button>
                </div>
            </li>
        `);
    })
}

// Create new task
$(document).on('submit', '#task-form', function(e) {
    e.preventDefault();

    let title = $('#task-title').val();

    $.ajax({
        url: '/tasks',
        method: 'POST',
        data: {
            _csrf_token: $('input[name="_token"]').val(),
            title: title
        },
        success: function() {
            $('#task-title').val('');

            loadTasks(); // Reload task list
        },
        error: function (error) {
            console.log('Error creating task: ', error);
        }
    });
});

// Toggle task status
$(document).on('click', '.toggle-task', function() {
    let button = $(this);
    const id = button.data('id');

    $.ajax({
        url: `/tasks/${id}/toggle`,
        method: 'POST',
        success: function(response) {
            const status = button.closest('li').find('.task-status');

            status.text(response.is_done ? 'Complete' : 'Pending')
                .toggleClass('bg-gray-50 text-gray-600 ring-gray-500/10 bg-green-50 text-green-700 ring-green-600/20');

            button.toggleClass('bg-indigo-600 bg-gray-200');        
            button.find('span[aria-hidden="true"]').toggleClass('translate-x-5 translate-x-0');
        },
        error: function (error) {
            console.log('Error toggling status: ', error);
        }
    });
});

// Delete task
$(document).on('click', '.delete-task', function() {
    let button = $(this);
    const id = button.data('id');

    $.ajax({
        url: `/tasks/${id}/delete`,
        method: 'POST',
        success: function() {
            button.closest('li').fadeOut(300, function() {
                $(this).remove();
                loadTasks(currentPage); // Reload task list
            });
        },
        error: function (error) {
            console.log('Error toggling status: ', error);
        }
    });
});

// Pagination text
function updatePaginationText() {
    const start = (currentPage - 1) * tasksPerPage + 1;
    const end = Math.min(currentPage * tasksPerPage, totalTasks);

    $('#pagination-start').text(start);
    $('#pagination-end').text(end);
    $('#pagination-total').text(totalTasks);
}

// Pagination buttons
function updatePaginationBtns() {
    const prevBtn = $('#prev-page');
    const nextBtn = $('#next-page');

    prevBtn.prop('disabled', currentPage === 1);
    nextBtn.prop('disabled', currentPage === totalPages);
}

// Previous page
$(document).on('click', '#prev-page', function() {
    if (currentPage > 1) {
        const newPage = currentPage - 1;
        currentPage = newPage;
        loadTasks(newPage);
    }
});

// Next page
$(document).on('click', '#next-page', function() {
    if (currentPage < totalPages) {
        const newPage = currentPage + 1;
        currentPage = newPage;
        loadTasks(newPage);
    }
});

// Toggle sort tasks menu
function toggleSortMenu() {
    $('#sort-menu').toggleClass('absolute hidden');
}
$(document).on('click', '#sort-tasks', function() {
    toggleSortMenu();
});
// Sort tasks
$(document).on('click', '.sort-item', function() {
    let button = $(this);
    const value = button.data('value');
    orderBy = value;

    $('#sort-menu button').removeClass('text-gray-900').addClass('text-gray-500');
    button.toggleClass('text-gray-900 text-gray-500');

    loadTasks(currentPage); // Reload task list

    toggleSortMenu();
});

$(function() {
   loadTasks();
});
