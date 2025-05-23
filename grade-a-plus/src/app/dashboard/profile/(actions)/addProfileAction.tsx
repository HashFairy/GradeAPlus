'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/app/utils/supabase/server';

export async function upsertProfile(formData: FormData) {
    try {
        const supabase = await createClient();

        // Get user
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
            return { error: 'Not authenticated' };
        }

        // Get form data
        const data = {
            user_id: user.id,
            university: formData.get('university') as string,
            field_of_study: formData.get('field_of_study') as string,
            year_of_study: parseInt(formData.get('year_of_study') as string),
            graduation_year: formData.get('graduation_year') ? parseInt(formData.get('graduation_year') as string) : null,
            first_name: formData.get('first_name') as string || null,
            last_name: formData.get('last_name') as string || null,
            gender: formData.get('gender') === 'other' ? formData.get('gender_other') as string : formData.get('gender') as string,
            age: parseInt(formData.get('age') as string),
            bio: formData.get('bio') as string || null,
            student_societies: JSON.parse(formData.get('student_societies_json') as string || '[]'),
            interests: JSON.parse(formData.get('interests_json') as string || '[]'),
            updated_at: new Date().toISOString()
        };

        // Save to database
        const { error } = await supabase
            .from('profiles')
            .upsert(data, { onConflict: 'user_id' });

        if (error) {
            return { error: error.message };
        }

        revalidatePath('/dashboard/profile');
        return { success: true };

    } catch (error) {
        return { error: 'Something went wrong' };
    }
}