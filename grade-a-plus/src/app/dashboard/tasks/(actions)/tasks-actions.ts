"use server";

import { createClient } from "@/app/utils/supabase/server";
import { revalidatePath } from "next/cache";

// Type for task data
type TaskData = {
    title: string;
    description?: string;
    status?: string;
    due_date?: string;
};

// Valid status values based on your database constraint
const VALID_STATUSES = ['upcoming', 'due', 'overdue', 'complete'];

/**
 * Create a new task
 */
export async function createTask(formData: FormData) {
    const supabase = await createClient();

    // Get authenticated user
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: "You must be logged in to create a task" };
    }

    // Extract task data from form
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    // Changed default status to "upcoming" which is in your constraint
    const status = formData.get("status") as string || "upcoming";
    const dueDateStr = formData.get("due_date") as string;

    // Validate required fields
    if (!title || title.trim() === "") {
        return { error: "Title is required" };
    }

    // Validate status is one of the allowed values
    if (status && !VALID_STATUSES.includes(status)) {
        return { error: `Invalid status value. Must be one of: ${VALID_STATUSES.join(', ')}` };
    }

    // Prepare task data
    const taskData: TaskData = {
        title: title.trim(),
    };

    // Add optional fields if they exist
    if (description && description.trim() !== "") {
        taskData.description = description.trim();
    }

    if (status && status.trim() !== "") {
        taskData.status = status.trim();
    }

    if (dueDateStr && dueDateStr.trim() !== "") {
        taskData.due_date = dueDateStr;
    }

    // Insert task into database
    const { data, error } = await supabase
        .from("task")
        .insert({
            ...taskData,
            user_id: user.id,
        })
        .select()
        .single();

    if (error) {
        console.error("Error creating task:", error);
        return { error: `Failed to create task: ${error.message}` };
    }

    // Revalidate the tasks page to show the new task
    revalidatePath("/dashboard/tasks");

    return { success: true, task: data };
}

/**
 * Update an existing task
 */
export async function updateTask(taskId: string, formData: FormData) {
    const supabase = await createClient();

    // Get authenticated user
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: "You must be logged in to update a task" };
    }

    // Extract task data from form
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const status = formData.get("status") as string;
    const dueDateStr = formData.get("due_date") as string;

    // Validate required fields
    if (!title || title.trim() === "") {
        return { error: "Title is required" };
    }

    // Validate status is one of the allowed values
    if (status && !VALID_STATUSES.includes(status)) {
        return { error: `Invalid status value. Must be one of: ${VALID_STATUSES.join(', ')}` };
    }

    // Prepare task data
    const taskData: TaskData = {
        title: title.trim(),
    };

    // Add optional fields if they exist
    if (description !== undefined) {
        taskData.description = description?.trim();
    }

    if (status && status.trim() !== "") {
        taskData.status = status.trim();
    }

    if (dueDateStr && dueDateStr.trim() !== "") {
        taskData.due_date = dueDateStr;
    }

    // First, verify the task belongs to the user
    const { data: existingTask, error: fetchError } = await supabase
        .from("task")
        .select("id")
        .eq("id", taskId)
        .eq("user_id", user.id)
        .single();

    if (fetchError || !existingTask) {
        return { error: "Task not found or you don't have permission to edit it" };
    }

    // Update the task
    const { data, error } = await supabase
        .from("task")
        .update({
            ...taskData,
            updated_at: new Date().toISOString(),
        })
        .eq("id", taskId)
        .eq("user_id", user.id)
        .select()
        .single();

    if (error) {
        console.error("Error updating task:", error);
        return { error: `Failed to update task: ${error.message}` };
    }

    // Revalidate the tasks page to show the updated task
    revalidatePath("/dashboard/tasks");

    return { success: true, task: data };
}

/**
 * Delete a task
 */
export async function deleteTask(taskId: string) {
    const supabase = await createClient();

    // Get authenticated user
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: "You must be logged in to delete a task" };
    }

    // First, verify the task belongs to the user
    const { data: existingTask, error: fetchError } = await supabase
        .from("task")
        .select("id")
        .eq("id", taskId)
        .eq("user_id", user.id)
        .single();

    if (fetchError || !existingTask) {
        return { error: "Task not found or you don't have permission to delete it" };
    }

    // Delete the task
    const { error } = await supabase
        .from("task")
        .delete()
        .eq("id", taskId)
        .eq("user_id", user.id);

    if (error) {
        console.error("Error deleting task:", error);
        return { error: `Failed to delete task: ${error.message}` };
    }

    // Revalidate the tasks page
    revalidatePath("/dashboard/tasks");

    return { success: true };
}

/**
 * Update task status (simplified update for quick status changes)
 */
export async function updateTaskStatus(taskId: string, status: string) {
    const supabase = await createClient();

    // Get authenticated user
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: "You must be logged in to update a task" };
    }

    // Validate status is one of the allowed values
    if (!VALID_STATUSES.includes(status)) {
        return { error: `Invalid status value. Must be one of: ${VALID_STATUSES.join(', ')}` };
    }

    // Update just the status
    const { data, error } = await supabase
        .from("task")
        .update({
            status,
            updated_at: new Date().toISOString(),
        })
        .eq("id", taskId)
        .eq("user_id", user.id)
        .select()
        .single();

    if (error) {
        console.error("Error updating task status:", error);
        return { error: `Failed to update task status: ${error.message}` };
    }

    // Revalidate the tasks page
    revalidatePath("/dashboard/tasks");

    return { success: true, task: data };
}
