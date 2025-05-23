export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export type Database = {
    graphql_public: {
        Tables: {
            [_ in never]: never
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            graphql: {
                Args: {
                    operationName?: string
                    query?: string
                    variables?: Json
                    extensions?: Json
                }
                Returns: Json
            }
        }
        Enums: {
            [_ in never]: never
        }
        CompositeTypes: {
            [_ in never]: never
        }
    }
    public: {
        Tables: {
            assessments: {
                Row: {
                    assessment_grade: number | null
                    assessment_name: string
                    assessment_weight: number
                    created_at: string | null
                    id: number
                    module_id: number
                    user_id: string
                }
                Insert: {
                    assessment_grade?: number | null
                    assessment_name: string
                    assessment_weight: number
                    created_at?: string | null
                    id?: number
                    module_id: number
                    user_id: string
                }
                Update: {
                    assessment_grade?: number | null
                    assessment_name?: string
                    assessment_weight?: number
                    created_at?: string | null
                    id?: number
                    module_id?: number
                    user_id?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "assessments_module_id_fkey"
                        columns: ["module_id"]
                        isOneToOne: false
                        referencedRelation: "modules"
                        referencedColumns: ["id"]
                    },
                ]
            }
            modules: {
                Row: {
                    created_at: string | null
                    id: number
                    module_credit: number
                    module_name: string
                    user_id: string
                    year_id: number
                }
                Insert: {
                    created_at?: string | null
                    id?: number
                    module_credit: number
                    module_name: string
                    user_id: string
                    year_id: number
                }
                Update: {
                    created_at?: string | null
                    id?: number
                    module_credit?: number
                    module_name?: string
                    user_id?: string
                    year_id?: number
                }
                Relationships: [
                    {
                        foreignKeyName: "modules_year_id_fkey"
                        columns: ["year_id"]
                        isOneToOne: false
                        referencedRelation: "years"
                        referencedColumns: ["id"]
                    },
                ]
            }
            profiles: {
                Row: {
                    age: number | null
                    bio: string | null
                    created_at: string | null
                    field_of_study: string | null
                    first_name: string | null
                    gender: string | null
                    graduation_year: number | null
                    interests: string[] | null
                    last_name: string | null
                    student_societies: string[] | null
                    university: string | null
                    updated_at: string | null
                    user_id: string
                    year_of_study: number | null
                }
                Insert: {
                    age?: number | null
                    bio?: string | null
                    created_at?: string | null
                    field_of_study?: string | null
                    first_name?: string | null
                    gender?: string | null
                    graduation_year?: number | null
                    interests?: string[] | null
                    last_name?: string | null
                    student_societies?: string[] | null
                    university?: string | null
                    updated_at?: string | null
                    user_id: string
                    year_of_study?: number | null
                }
                Update: {
                    age?: number | null
                    bio?: string | null
                    created_at?: string | null
                    field_of_study?: string | null
                    first_name?: string | null
                    gender?: string | null
                    graduation_year?: number | null
                    interests?: string[] | null
                    last_name?: string | null
                    student_societies?: string[] | null
                    university?: string | null
                    updated_at?: string | null
                    user_id?: string
                    year_of_study?: number | null
                }
                Relationships: []
            }
            task: {
                Row: {
                    created_at: string | null
                    description: string | null
                    due_date: string
                    id: string
                    status: string | null
                    title: string
                    updated_at: string | null
                    user_id: string | null
                }
                Insert: {
                    created_at?: string | null
                    description?: string | null
                    due_date: string
                    id?: string
                    status?: string | null
                    title: string
                    updated_at?: string | null
                    user_id?: string | null
                }
                Update: {
                    created_at?: string | null
                    description?: string | null
                    due_date?: string
                    id?: string
                    status?: string | null
                    title?: string
                    updated_at?: string | null
                    user_id?: string | null
                }
                Relationships: []
            }
            years: {
                Row: {
                    created_at: string | null
                    id: number
                    user_id: string
                    year_credit: number
                    year_number: number
                    year_weight: number
                }
                Insert: {
                    created_at?: string | null
                    id?: number
                    user_id: string
                    year_credit: number
                    year_number: number
                    year_weight: number
                }
                Update: {
                    created_at?: string | null
                    id?: number
                    user_id?: string
                    year_credit?: number
                    year_number?: number
                    year_weight?: number
                }
                Relationships: []
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            [_ in never]: never
        }
        CompositeTypes: {
            [_ in never]: never
        }
    }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
    DefaultSchemaTableNameOrOptions extends
            | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
        | { schema: keyof Database },
    TableName extends DefaultSchemaTableNameOrOptions extends {
            schema: keyof Database
        }
        ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
            Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
        : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
    ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
            Row: infer R
        }
        ? R
        : never
    : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
            DefaultSchema["Views"])
        ? (DefaultSchema["Tables"] &
            DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
                Row: infer R
            }
            ? R
            : never
        : never

export type TablesInsert<
    DefaultSchemaTableNameOrOptions extends
            | keyof DefaultSchema["Tables"]
        | { schema: keyof Database },
    TableName extends DefaultSchemaTableNameOrOptions extends {
            schema: keyof Database
        }
        ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
        : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
    ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
            Insert: infer I
        }
        ? I
        : never
    : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
        ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
                Insert: infer I
            }
            ? I
            : never
        : never

export type TablesUpdate<
    DefaultSchemaTableNameOrOptions extends
            | keyof DefaultSchema["Tables"]
        | { schema: keyof Database },
    TableName extends DefaultSchemaTableNameOrOptions extends {
            schema: keyof Database
        }
        ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
        : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
    ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
            Update: infer U
        }
        ? U
        : never
    : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
        ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
                Update: infer U
            }
            ? U
            : never
        : never

export type Enums<
    DefaultSchemaEnumNameOrOptions extends
            | keyof DefaultSchema["Enums"]
        | { schema: keyof Database },
    EnumName extends DefaultSchemaEnumNameOrOptions extends {
            schema: keyof Database
        }
        ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
        : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
    ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
    : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
        ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
        : never

export type CompositeTypes<
    PublicCompositeTypeNameOrOptions extends
            | keyof DefaultSchema["CompositeTypes"]
        | { schema: keyof Database },
    CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
            schema: keyof Database
        }
        ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
        : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
    ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
    : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
        ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
        : never

export const Constants = {
    graphql_public: {
        Enums: {},
    },
    public: {
        Enums: {},
    },
} as const
