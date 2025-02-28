import $ from 'jquery';

// fetch tasks via Ajax
function loadTasks(page = 1) {
    $.ajax({
        url: `/tasks?page=${page}`,
        method: 'GET',
        dataType: 'json',
        success: function (response) {
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
                        <p class="mt-0.5 whitespace-nowrap rounded-md px-1.5 py-0.5 text-xs font-medium ring-1 ring-inset ${task.is_done ? 'bg-green-50 text-green-700 ring-green-600/20' : 'bg-gray-50 text-gray-600 ring-gray-500/10'}">${task.is_done ? 'Complete' : 'Pending'}</p>
                    </div>
                </div>
                <div class="flex flex-none items-center gap-x-4">
                    <button class="hidden rounded-md bg-red-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm ring-1 ring-inset hover:bg-red-500 sm:block">Delete</button>
                </div>
            </li>
        `);
    })
}

$(function() {
   loadTasks();
});
