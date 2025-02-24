export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      admins: {
        Row: {
          admin_uuid: string
          created_at: string
          id: number
          user_uuid: string | null
        }
        Insert: {
          admin_uuid?: string
          created_at?: string
          id?: number
          user_uuid?: string | null
        }
        Update: {
          admin_uuid?: string
          created_at?: string
          id?: number
          user_uuid?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "admins_user_uuid_fkey"
            columns: ["user_uuid"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_uuid"]
          },
        ]
      }
      affiliates: {
        Row: {
          affiliate_code: string | null
          affiliate_count: number | null
          affiliate_uuid: string
          commissions_available: number | null
          commissions_made: number | null
          commissions_paid: number | null
          created_at: string
          email: string | null
          id: number
          paypal: string | null
          status: Database["public"]["Enums"]["affiliate_status"] | null
          transaction_count: number | null
        }
        Insert: {
          affiliate_code?: string | null
          affiliate_count?: number | null
          affiliate_uuid?: string
          commissions_available?: number | null
          commissions_made?: number | null
          commissions_paid?: number | null
          created_at?: string
          email?: string | null
          id?: number
          paypal?: string | null
          status?: Database["public"]["Enums"]["affiliate_status"] | null
          transaction_count?: number | null
        }
        Update: {
          affiliate_code?: string | null
          affiliate_count?: number | null
          affiliate_uuid?: string
          commissions_available?: number | null
          commissions_made?: number | null
          commissions_paid?: number | null
          created_at?: string
          email?: string | null
          id?: number
          paypal?: string | null
          status?: Database["public"]["Enums"]["affiliate_status"] | null
          transaction_count?: number | null
        }
        Relationships: []
      }
      applications: {
        Row: {
          application_uuid: string
          bid_amount: number | null
          created_at: string
          id: number
          job_uuid: string | null
          message: string | null
          status: Database["public"]["Enums"]["applications_status"] | null
          user_email: string | null
          user_name: string | null
          user_uuid: string | null
        }
        Insert: {
          application_uuid?: string
          bid_amount?: number | null
          created_at?: string
          id?: number
          job_uuid?: string | null
          message?: string | null
          status?: Database["public"]["Enums"]["applications_status"] | null
          user_email?: string | null
          user_name?: string | null
          user_uuid?: string | null
        }
        Update: {
          application_uuid?: string
          bid_amount?: number | null
          created_at?: string
          id?: number
          job_uuid?: string | null
          message?: string | null
          status?: Database["public"]["Enums"]["applications_status"] | null
          user_email?: string | null
          user_name?: string | null
          user_uuid?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "applications_job_uuid_fkey"
            columns: ["job_uuid"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["job_uuid"]
          },
          {
            foreignKeyName: "applications_user_uuid_fkey"
            columns: ["user_uuid"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_uuid"]
          },
        ]
      }
      articles: {
        Row: {
          article_uuid: string
          created_at: string
          description: string | null
          html: string | null
          id: number
          keyword: string | null
          lecture_time: number | null
          slug: string | null
          title: string | null
          url: string | null
          user_name: string | null
          user_uuid: string | null
        }
        Insert: {
          article_uuid?: string
          created_at?: string
          description?: string | null
          html?: string | null
          id?: number
          keyword?: string | null
          lecture_time?: number | null
          slug?: string | null
          title?: string | null
          url?: string | null
          user_name?: string | null
          user_uuid?: string | null
        }
        Update: {
          article_uuid?: string
          created_at?: string
          description?: string | null
          html?: string | null
          id?: number
          keyword?: string | null
          lecture_time?: number | null
          slug?: string | null
          title?: string | null
          url?: string | null
          user_name?: string | null
          user_uuid?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "articles_user_uuid_fkey"
            columns: ["user_uuid"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_uuid"]
          },
        ]
      }
      classrooms: {
        Row: {
          classroom_uuid: string
          community_uuid: string | null
          created_at: string
          description: string | null
          id: number
          lesson_count: number | null
          name: string | null
          notified: boolean | null
          notify: boolean | null
          owner_user_uuid: string | null
          status: Database["public"]["Enums"]["classroom_status"] | null
          summary: string | null
          video_url: string | null
        }
        Insert: {
          classroom_uuid?: string
          community_uuid?: string | null
          created_at?: string
          description?: string | null
          id?: number
          lesson_count?: number | null
          name?: string | null
          notified?: boolean | null
          notify?: boolean | null
          owner_user_uuid?: string | null
          status?: Database["public"]["Enums"]["classroom_status"] | null
          summary?: string | null
          video_url?: string | null
        }
        Update: {
          classroom_uuid?: string
          community_uuid?: string | null
          created_at?: string
          description?: string | null
          id?: number
          lesson_count?: number | null
          name?: string | null
          notified?: boolean | null
          notify?: boolean | null
          owner_user_uuid?: string | null
          status?: Database["public"]["Enums"]["classroom_status"] | null
          summary?: string | null
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "classrooms_community_uuid_fkey"
            columns: ["community_uuid"]
            isOneToOne: false
            referencedRelation: "communities"
            referencedColumns: ["community_uuid"]
          },
          {
            foreignKeyName: "classrooms_owner_user_uuid_fkey"
            columns: ["owner_user_uuid"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_uuid"]
          },
        ]
      }
      communities: {
        Row: {
          community_uuid: string
          created_at: string
          id: number
          user_uuid: string | null
        }
        Insert: {
          community_uuid?: string
          created_at?: string
          id?: number
          user_uuid?: string | null
        }
        Update: {
          community_uuid?: string
          created_at?: string
          id?: number
          user_uuid?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "communities_user_uuid_fkey"
            columns: ["user_uuid"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_uuid"]
          },
        ]
      }
      community_messages: {
        Row: {
          community_message_uuid: string
          created_at: string
          id: number
          message: string | null
          thread_uuid: string | null
          user_name: string | null
          user_uuid: string | null
        }
        Insert: {
          community_message_uuid?: string
          created_at?: string
          id?: number
          message?: string | null
          thread_uuid?: string | null
          user_name?: string | null
          user_uuid?: string | null
        }
        Update: {
          community_message_uuid?: string
          created_at?: string
          id?: number
          message?: string | null
          thread_uuid?: string | null
          user_name?: string | null
          user_uuid?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "community_messages_thread_uuid_fkey"
            columns: ["thread_uuid"]
            isOneToOne: false
            referencedRelation: "threads"
            referencedColumns: ["thread_uuid"]
          },
          {
            foreignKeyName: "community_messages_user_uuid_fkey"
            columns: ["user_uuid"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_uuid"]
          },
        ]
      }
      community_prices: {
        Row: {
          amount: number | null
          community_price_uuid: string
          community_uuid: string | null
          created_at: string
          id: number
          status: Database["public"]["Enums"]["community_price_status"] | null
          stripe_id: string | null
          total_amount: number | null
        }
        Insert: {
          amount?: number | null
          community_price_uuid?: string
          community_uuid?: string | null
          created_at?: string
          id?: number
          status?: Database["public"]["Enums"]["community_price_status"] | null
          stripe_id?: string | null
          total_amount?: number | null
        }
        Update: {
          amount?: number | null
          community_price_uuid?: string
          community_uuid?: string | null
          created_at?: string
          id?: number
          status?: Database["public"]["Enums"]["community_price_status"] | null
          stripe_id?: string | null
          total_amount?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "community_prices_community_uuid_fkey"
            columns: ["community_uuid"]
            isOneToOne: false
            referencedRelation: "communities"
            referencedColumns: ["community_uuid"]
          },
        ]
      }
      community_subscriptions: {
        Row: {
          cancelled_at: string | null
          community_price_uuid: string | null
          community_subscription_uuid: string
          community_uuid: string | null
          created_at: string
          id: number
          seller_user_uuid: string | null
          status:
            | Database["public"]["Enums"]["community_subscription_status"]
            | null
          stripe_id: string | null
          total_amount: number | null
          user_uuid: string | null
          utm_campaign: string | null
          utm_content: string | null
          utm_id: string | null
          utm_medium: string | null
          utm_source: string | null
          utm_term: string | null
        }
        Insert: {
          cancelled_at?: string | null
          community_price_uuid?: string | null
          community_subscription_uuid?: string
          community_uuid?: string | null
          created_at?: string
          id?: number
          seller_user_uuid?: string | null
          status?:
            | Database["public"]["Enums"]["community_subscription_status"]
            | null
          stripe_id?: string | null
          total_amount?: number | null
          user_uuid?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_id?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
        }
        Update: {
          cancelled_at?: string | null
          community_price_uuid?: string | null
          community_subscription_uuid?: string
          community_uuid?: string | null
          created_at?: string
          id?: number
          seller_user_uuid?: string | null
          status?:
            | Database["public"]["Enums"]["community_subscription_status"]
            | null
          stripe_id?: string | null
          total_amount?: number | null
          user_uuid?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_id?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "community_subscriptions_community_price_uuid_fkey"
            columns: ["community_price_uuid"]
            isOneToOne: false
            referencedRelation: "community_prices"
            referencedColumns: ["community_price_uuid"]
          },
          {
            foreignKeyName: "community_subscriptions_community_uuid_fkey"
            columns: ["community_uuid"]
            isOneToOne: false
            referencedRelation: "communities"
            referencedColumns: ["community_uuid"]
          },
          {
            foreignKeyName: "community_subscriptions_seller_user_uuid_fkey"
            columns: ["seller_user_uuid"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_uuid"]
          },
          {
            foreignKeyName: "community_subscriptions_user_uuid_fkey"
            columns: ["user_uuid"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_uuid"]
          },
        ]
      }
      community_subscriptions_transactions: {
        Row: {
          amount: number | null
          community_price_uuid: string | null
          community_subscription_transaction_uuid: string
          community_uuid: string | null
          created_at: string
          id: number
          stripe_id: string | null
        }
        Insert: {
          amount?: number | null
          community_price_uuid?: string | null
          community_subscription_transaction_uuid?: string
          community_uuid?: string | null
          created_at?: string
          id?: number
          stripe_id?: string | null
        }
        Update: {
          amount?: number | null
          community_price_uuid?: string | null
          community_subscription_transaction_uuid?: string
          community_uuid?: string | null
          created_at?: string
          id?: number
          stripe_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "community_subscriptions_transactions_community_price_uuid_fkey"
            columns: ["community_price_uuid"]
            isOneToOne: false
            referencedRelation: "community_prices"
            referencedColumns: ["community_price_uuid"]
          },
          {
            foreignKeyName: "community_subscriptions_transactions_community_uuid_fkey"
            columns: ["community_uuid"]
            isOneToOne: false
            referencedRelation: "communities"
            referencedColumns: ["community_uuid"]
          },
        ]
      }
      conversations: {
        Row: {
          conversation_uuid: string
          created_at: string
          draft_created: boolean | null
          id: number
          job_name: string | null
          job_uuid: string | null
          message_count: number | null
          product_name: string | null
          product_uuid: string | null
          source: Database["public"]["Enums"]["conversation_source"] | null
          status: Database["public"]["Enums"]["conversation_status"] | null
          subject: string | null
          transaction_uuid: string | null
          user_recipient_name: string | null
          user_recipient_uuid: string | null
          user_starter_name: string | null
          user_starter_uuid: string | null
        }
        Insert: {
          conversation_uuid?: string
          created_at?: string
          draft_created?: boolean | null
          id?: number
          job_name?: string | null
          job_uuid?: string | null
          message_count?: number | null
          product_name?: string | null
          product_uuid?: string | null
          source?: Database["public"]["Enums"]["conversation_source"] | null
          status?: Database["public"]["Enums"]["conversation_status"] | null
          subject?: string | null
          transaction_uuid?: string | null
          user_recipient_name?: string | null
          user_recipient_uuid?: string | null
          user_starter_name?: string | null
          user_starter_uuid?: string | null
        }
        Update: {
          conversation_uuid?: string
          created_at?: string
          draft_created?: boolean | null
          id?: number
          job_name?: string | null
          job_uuid?: string | null
          message_count?: number | null
          product_name?: string | null
          product_uuid?: string | null
          source?: Database["public"]["Enums"]["conversation_source"] | null
          status?: Database["public"]["Enums"]["conversation_status"] | null
          subject?: string | null
          transaction_uuid?: string | null
          user_recipient_name?: string | null
          user_recipient_uuid?: string | null
          user_starter_name?: string | null
          user_starter_uuid?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "conversations_job_uuid_fkey"
            columns: ["job_uuid"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["job_uuid"]
          },
          {
            foreignKeyName: "conversations_product_uuid_fkey"
            columns: ["product_uuid"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["product_uuid"]
          },
          {
            foreignKeyName: "conversations_transaction_uuid_fkey"
            columns: ["transaction_uuid"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["transaction_uuid"]
          },
          {
            foreignKeyName: "conversations_user_recipient_uuid_fkey"
            columns: ["user_recipient_uuid"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_uuid"]
          },
          {
            foreignKeyName: "conversations_user_starter_uuid_fkey"
            columns: ["user_starter_uuid"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_uuid"]
          },
        ]
      }
      events: {
        Row: {
          created_at: string
          event_uuid: string
          id: number
        }
        Insert: {
          created_at?: string
          event_uuid?: string
          id?: number
        }
        Update: {
          created_at?: string
          event_uuid?: string
          id?: number
        }
        Relationships: []
      }
      experts: {
        Row: {
          client_satisfaction: number | null
          completed_projects: number | null
          created_at: string
          description: string | null
          expert_uuid: string
          id: number
          info: string | null
          location: string | null
          name: string | null
          response_rate: number | null
          slug: string | null
          title: string | null
        }
        Insert: {
          client_satisfaction?: number | null
          completed_projects?: number | null
          created_at?: string
          description?: string | null
          expert_uuid?: string
          id?: number
          info?: string | null
          location?: string | null
          name?: string | null
          response_rate?: number | null
          slug?: string | null
          title?: string | null
        }
        Update: {
          client_satisfaction?: number | null
          completed_projects?: number | null
          created_at?: string
          description?: string | null
          expert_uuid?: string
          id?: number
          info?: string | null
          location?: string | null
          name?: string | null
          response_rate?: number | null
          slug?: string | null
          title?: string | null
        }
        Relationships: []
      }
      jobs: {
        Row: {
          amount: number | null
          applicant_count: number | null
          completed_at: string | null
          created_at: string
          description: string | null
          id: number
          job_transaction_uuid: string | null
          job_uuid: string
          paid_at: string | null
          status: Database["public"]["Enums"]["job_status"] | null
          tech_stack: string | null
          title: string | null
          transaction_uuid: string | null
          user_email: string | null
          user_name: string | null
          user_uuid: string | null
        }
        Insert: {
          amount?: number | null
          applicant_count?: number | null
          completed_at?: string | null
          created_at?: string
          description?: string | null
          id?: number
          job_transaction_uuid?: string | null
          job_uuid: string
          paid_at?: string | null
          status?: Database["public"]["Enums"]["job_status"] | null
          tech_stack?: string | null
          title?: string | null
          transaction_uuid?: string | null
          user_email?: string | null
          user_name?: string | null
          user_uuid?: string | null
        }
        Update: {
          amount?: number | null
          applicant_count?: number | null
          completed_at?: string | null
          created_at?: string
          description?: string | null
          id?: number
          job_transaction_uuid?: string | null
          job_uuid?: string
          paid_at?: string | null
          status?: Database["public"]["Enums"]["job_status"] | null
          tech_stack?: string | null
          title?: string | null
          transaction_uuid?: string | null
          user_email?: string | null
          user_name?: string | null
          user_uuid?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "jobs_job_transaction_uuid_fkey"
            columns: ["job_transaction_uuid"]
            isOneToOne: false
            referencedRelation: "jobs_transactions"
            referencedColumns: ["job_transaction_uuid"]
          },
          {
            foreignKeyName: "jobs_transaction_uuid_fkey"
            columns: ["transaction_uuid"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["transaction_uuid"]
          },
          {
            foreignKeyName: "jobs_user_uuid_fkey"
            columns: ["user_uuid"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_uuid"]
          },
        ]
      }
      jobs_transactions: {
        Row: {
          created_at: string
          id: number
          job_transaction_uuid: string
        }
        Insert: {
          created_at?: string
          id?: number
          job_transaction_uuid?: string
        }
        Update: {
          created_at?: string
          id?: number
          job_transaction_uuid?: string
        }
        Relationships: []
      }
      lessons: {
        Row: {
          classroom_uuid: string | null
          created_at: string
          description: string | null
          id: number
          introduction: string | null
          lesson_uuid: string
          name: string | null
          thumbnail_url: string | null
          user_uuid: string | null
          video_url: string | null
        }
        Insert: {
          classroom_uuid?: string | null
          created_at?: string
          description?: string | null
          id?: number
          introduction?: string | null
          lesson_uuid?: string
          name?: string | null
          thumbnail_url?: string | null
          user_uuid?: string | null
          video_url?: string | null
        }
        Update: {
          classroom_uuid?: string | null
          created_at?: string
          description?: string | null
          id?: number
          introduction?: string | null
          lesson_uuid?: string
          name?: string | null
          thumbnail_url?: string | null
          user_uuid?: string | null
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lessons_classroom_uuid_fkey"
            columns: ["classroom_uuid"]
            isOneToOne: false
            referencedRelation: "classrooms"
            referencedColumns: ["classroom_uuid"]
          },
          {
            foreignKeyName: "lessons_user_uuid_fkey"
            columns: ["user_uuid"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_uuid"]
          },
        ]
      }
      messages: {
        Row: {
          conversation_uuid: string | null
          created_at: string
          id: number
          message_uuid: string
          user_name: string | null
          user_uuid: string | null
        }
        Insert: {
          conversation_uuid?: string | null
          created_at?: string
          id?: number
          message_uuid?: string
          user_name?: string | null
          user_uuid?: string | null
        }
        Update: {
          conversation_uuid?: string | null
          created_at?: string
          id?: number
          message_uuid?: string
          user_name?: string | null
          user_uuid?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_uuid_fkey"
            columns: ["conversation_uuid"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["conversation_uuid"]
          },
          {
            foreignKeyName: "messages_user_uuid_fkey"
            columns: ["user_uuid"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_uuid"]
          },
        ]
      }
      payouts: {
        Row: {
          amount: number | null
          created_at: string
          id: number
          payout_uuid: string
          paypal: string | null
          status: Database["public"]["Enums"]["payout_status"] | null
          user_email: string | null
          user_name: string | null
          user_uuid: string | null
        }
        Insert: {
          amount?: number | null
          created_at?: string
          id?: number
          payout_uuid: string
          paypal?: string | null
          status?: Database["public"]["Enums"]["payout_status"] | null
          user_email?: string | null
          user_name?: string | null
          user_uuid?: string | null
        }
        Update: {
          amount?: number | null
          created_at?: string
          id?: number
          payout_uuid?: string
          paypal?: string | null
          status?: Database["public"]["Enums"]["payout_status"] | null
          user_email?: string | null
          user_name?: string | null
          user_uuid?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payouts_user_uuid_fkey"
            columns: ["user_uuid"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_uuid"]
          },
        ]
      }
      products: {
        Row: {
          accept_terms: boolean | null
          affiliate_program: boolean | null
          affiliation_amount: number | null
          change_reasons: string | null
          changes_neeeded: string | null
          created_at: string
          demo: string | null
          description: string | null
          difficulty_level: string | null
          fees_amount: number | null
          free_or_paid:
            | Database["public"]["Enums"]["product_free_or_paid"]
            | null
          id: number
          name: string | null
          product_includes: string | null
          product_uuid: string
          public_link: string | null
          reviewed_by: string | null
          sales_amount: number | null
          sales_count: number | null
          slug: string | null
          tech_stack: string | null
          tech_stack_price: string | null
          type: Database["public"]["Enums"]["product_type"] | null
          use_case: string | null
          user_uuid: string | null
          utm_campaign: string | null
          utm_content: string | null
          utm_id: string | null
          utm_medium: string | null
          utm_source: string | null
          utm_term: string | null
        }
        Insert: {
          accept_terms?: boolean | null
          affiliate_program?: boolean | null
          affiliation_amount?: number | null
          change_reasons?: string | null
          changes_neeeded?: string | null
          created_at?: string
          demo?: string | null
          description?: string | null
          difficulty_level?: string | null
          fees_amount?: number | null
          free_or_paid?:
            | Database["public"]["Enums"]["product_free_or_paid"]
            | null
          id?: number
          name?: string | null
          product_includes?: string | null
          product_uuid?: string
          public_link?: string | null
          reviewed_by?: string | null
          sales_amount?: number | null
          sales_count?: number | null
          slug?: string | null
          tech_stack?: string | null
          tech_stack_price?: string | null
          type?: Database["public"]["Enums"]["product_type"] | null
          use_case?: string | null
          user_uuid?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_id?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
        }
        Update: {
          accept_terms?: boolean | null
          affiliate_program?: boolean | null
          affiliation_amount?: number | null
          change_reasons?: string | null
          changes_neeeded?: string | null
          created_at?: string
          demo?: string | null
          description?: string | null
          difficulty_level?: string | null
          fees_amount?: number | null
          free_or_paid?:
            | Database["public"]["Enums"]["product_free_or_paid"]
            | null
          id?: number
          name?: string | null
          product_includes?: string | null
          product_uuid?: string
          public_link?: string | null
          reviewed_by?: string | null
          sales_amount?: number | null
          sales_count?: number | null
          slug?: string | null
          tech_stack?: string | null
          tech_stack_price?: string | null
          type?: Database["public"]["Enums"]["product_type"] | null
          use_case?: string | null
          user_uuid?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_id?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "products_user_uuid_fkey"
            columns: ["user_uuid"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_uuid"]
          },
        ]
      }
      products_transactions: {
        Row: {
          created_at: string
          id: number
          product_transaction_uuid: string
        }
        Insert: {
          created_at?: string
          id?: number
          product_transaction_uuid?: string
        }
        Update: {
          created_at?: string
          id?: number
          product_transaction_uuid?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          buyer_email: string | null
          buyer_name: string | null
          comments: string | null
          created_at: string
          product_uuid: string | null
          rating: number | null
          review_uuid: string
          seller_user_uuid: string | null
          status: Database["public"]["Enums"]["review_status"] | null
          title: string | null
          transaction_type:
            | Database["public"]["Enums"]["transaction_type"]
            | null
          transaction_uuid: string | null
          verified: boolean | null
        }
        Insert: {
          buyer_email?: string | null
          buyer_name?: string | null
          comments?: string | null
          created_at?: string
          product_uuid?: string | null
          rating?: number | null
          review_uuid?: string
          seller_user_uuid?: string | null
          status?: Database["public"]["Enums"]["review_status"] | null
          title?: string | null
          transaction_type?:
            | Database["public"]["Enums"]["transaction_type"]
            | null
          transaction_uuid?: string | null
          verified?: boolean | null
        }
        Update: {
          buyer_email?: string | null
          buyer_name?: string | null
          comments?: string | null
          created_at?: string
          product_uuid?: string | null
          rating?: number | null
          review_uuid?: string
          seller_user_uuid?: string | null
          status?: Database["public"]["Enums"]["review_status"] | null
          title?: string | null
          transaction_type?:
            | Database["public"]["Enums"]["transaction_type"]
            | null
          transaction_uuid?: string | null
          verified?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_product_uuid_fkey"
            columns: ["product_uuid"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["product_uuid"]
          },
          {
            foreignKeyName: "reviews_seller_user_uuid_fkey"
            columns: ["seller_user_uuid"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_uuid"]
          },
          {
            foreignKeyName: "reviews_transaction_uuid_fkey"
            columns: ["transaction_uuid"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["transaction_uuid"]
          },
        ]
      }
      service_prices: {
        Row: {
          amount: number | null
          created_at: string
          id: number
          service_price_status:
            | Database["public"]["Enums"]["service_price_status"]
            | null
          service_price_uuid: string
          service_uuid: string | null
          stripe_id: string | null
          total_amount: number | null
        }
        Insert: {
          amount?: number | null
          created_at?: string
          id?: number
          service_price_status?:
            | Database["public"]["Enums"]["service_price_status"]
            | null
          service_price_uuid?: string
          service_uuid?: string | null
          stripe_id?: string | null
          total_amount?: number | null
        }
        Update: {
          amount?: number | null
          created_at?: string
          id?: number
          service_price_status?:
            | Database["public"]["Enums"]["service_price_status"]
            | null
          service_price_uuid?: string
          service_uuid?: string | null
          stripe_id?: string | null
          total_amount?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "service_prices_service_uuid_fkey"
            columns: ["service_uuid"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["service_uuid"]
          },
        ]
      }
      service_subscriptions: {
        Row: {
          cancelled_at: string | null
          created_at: string
          id: number
          seller_user_uuid: string | null
          service_subscription_uuid: string
          service_uuid: string | null
          status:
            | Database["public"]["Enums"]["service_subscription_status"]
            | null
          stripe_id: string | null
          total_amount: number | null
          user_uuid: string | null
          utm_campaign: string | null
          utm_content: string | null
          utm_id: string | null
          utm_medium: string | null
          utm_source: string | null
          utm_term: string | null
        }
        Insert: {
          cancelled_at?: string | null
          created_at?: string
          id?: number
          seller_user_uuid?: string | null
          service_subscription_uuid?: string
          service_uuid?: string | null
          status?:
            | Database["public"]["Enums"]["service_subscription_status"]
            | null
          stripe_id?: string | null
          total_amount?: number | null
          user_uuid?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_id?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
        }
        Update: {
          cancelled_at?: string | null
          created_at?: string
          id?: number
          seller_user_uuid?: string | null
          service_subscription_uuid?: string
          service_uuid?: string | null
          status?:
            | Database["public"]["Enums"]["service_subscription_status"]
            | null
          stripe_id?: string | null
          total_amount?: number | null
          user_uuid?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_id?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "service_subscriptions_seller_user_uuid_fkey"
            columns: ["seller_user_uuid"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_uuid"]
          },
          {
            foreignKeyName: "service_subscriptions_service_uuid_fkey"
            columns: ["service_uuid"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["service_uuid"]
          },
          {
            foreignKeyName: "service_subscriptions_user_uuid_fkey"
            columns: ["user_uuid"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_uuid"]
          },
        ]
      }
      service_subscriptions_transactions: {
        Row: {
          amount: number | null
          created_at: string
          id: number
          seller_user_uuid: string | null
          service_price_uuid: string | null
          service_subscription_transactions_uuid: string
          service_uuid: string | null
          user_uuid: string | null
        }
        Insert: {
          amount?: number | null
          created_at?: string
          id?: number
          seller_user_uuid?: string | null
          service_price_uuid?: string | null
          service_subscription_transactions_uuid?: string
          service_uuid?: string | null
          user_uuid?: string | null
        }
        Update: {
          amount?: number | null
          created_at?: string
          id?: number
          seller_user_uuid?: string | null
          service_price_uuid?: string | null
          service_subscription_transactions_uuid?: string
          service_uuid?: string | null
          user_uuid?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "service_subscriptions_transactions_seller_user_uuid_fkey"
            columns: ["seller_user_uuid"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_uuid"]
          },
          {
            foreignKeyName: "service_subscriptions_transactions_service_price_uuid_fkey"
            columns: ["service_price_uuid"]
            isOneToOne: false
            referencedRelation: "service_prices"
            referencedColumns: ["service_price_uuid"]
          },
          {
            foreignKeyName: "service_subscriptions_transactions_service_uuid_fkey"
            columns: ["service_uuid"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["service_uuid"]
          },
          {
            foreignKeyName: "service_subscriptions_transactions_user_uuid_fkey"
            columns: ["user_uuid"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_uuid"]
          },
        ]
      }
      services: {
        Row: {
          active_subscriptions_count: number | null
          created_at: string
          description: string | null
          features: Json | null
          id: number
          monthly_recurring_revenue: number | null
          name: string | null
          payment_url: string | null
          price: number | null
          revenue_amount: number | null
          service_uuid: string
          stripe_price_id: string | null
          stripe_product_id: string | null
          type: Database["public"]["Enums"]["service_type"] | null
          user_uuid: string | null
        }
        Insert: {
          active_subscriptions_count?: number | null
          created_at?: string
          description?: string | null
          features?: Json | null
          id?: number
          monthly_recurring_revenue?: number | null
          name?: string | null
          payment_url?: string | null
          price?: number | null
          revenue_amount?: number | null
          service_uuid?: string
          stripe_price_id?: string | null
          stripe_product_id?: string | null
          type?: Database["public"]["Enums"]["service_type"] | null
          user_uuid?: string | null
        }
        Update: {
          active_subscriptions_count?: number | null
          created_at?: string
          description?: string | null
          features?: Json | null
          id?: number
          monthly_recurring_revenue?: number | null
          name?: string | null
          payment_url?: string | null
          price?: number | null
          revenue_amount?: number | null
          service_uuid?: string
          stripe_price_id?: string | null
          stripe_product_id?: string | null
          type?: Database["public"]["Enums"]["service_type"] | null
          user_uuid?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "services_user_uuid_fkey"
            columns: ["user_uuid"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_uuid"]
          },
        ]
      }
      threads: {
        Row: {
          community_uuid: string | null
          created_at: string
          id: number
          initial_message: string | null
          last_message: string | null
          number_messages: number | null
          status: Database["public"]["Enums"]["thread_status"] | null
          tag: Database["public"]["Enums"]["thread_tag"] | null
          thread_uuid: string
          title: string | null
          user_name: string | null
          user_uuid: string | null
        }
        Insert: {
          community_uuid?: string | null
          created_at?: string
          id?: number
          initial_message?: string | null
          last_message?: string | null
          number_messages?: number | null
          status?: Database["public"]["Enums"]["thread_status"] | null
          tag?: Database["public"]["Enums"]["thread_tag"] | null
          thread_uuid?: string
          title?: string | null
          user_name?: string | null
          user_uuid?: string | null
        }
        Update: {
          community_uuid?: string | null
          created_at?: string
          id?: number
          initial_message?: string | null
          last_message?: string | null
          number_messages?: number | null
          status?: Database["public"]["Enums"]["thread_status"] | null
          tag?: Database["public"]["Enums"]["thread_tag"] | null
          thread_uuid?: string
          title?: string | null
          user_name?: string | null
          user_uuid?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "threads_community_uuid_fkey"
            columns: ["community_uuid"]
            isOneToOne: false
            referencedRelation: "communities"
            referencedColumns: ["community_uuid"]
          },
          {
            foreignKeyName: "threads_user_uuid_fkey"
            columns: ["user_uuid"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_uuid"]
          },
        ]
      }
      tickets: {
        Row: {
          created_at: string
          email: string | null
          id: number
          message: string | null
          name: string | null
          rating: number | null
          status: Database["public"]["Enums"]["ticket_status"] | null
          ticket_uuid: string
          type: Database["public"]["Enums"]["ticket_status"] | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: number
          message?: string | null
          name?: string | null
          rating?: number | null
          status?: Database["public"]["Enums"]["ticket_status"] | null
          ticket_uuid?: string
          type?: Database["public"]["Enums"]["ticket_status"] | null
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: number
          message?: string | null
          name?: string | null
          rating?: number | null
          status?: Database["public"]["Enums"]["ticket_status"] | null
          ticket_uuid?: string
          type?: Database["public"]["Enums"]["ticket_status"] | null
        }
        Relationships: []
      }
      transactions: {
        Row: {
          created_at: string
          id: number
          transaction_uuid: string
        }
        Insert: {
          created_at?: string
          id?: number
          transaction_uuid: string
        }
        Update: {
          created_at?: string
          id?: number
          transaction_uuid?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          active_product_count: number | null
          affiliate_fees_amount: number | null
          affiliate_id: string | null
          affiliate_link: string | null
          affiliate_multiplier: number | null
          affiliate_since: string | null
          available_amount: number | null
          average_review: number | null
          created_at: string
          email: string
          fees_amount: number | null
          first_name: string | null
          id: number
          is_admin: boolean | null
          is_affiliate: boolean | null
          is_member: boolean | null
          job_amount_spent: number | null
          job_sales_amount: number | null
          last_name: string | null
          member_profile_link: string | null
          net_sales_amount: number | null
          payout_amount: number | null
          product_amount_spent: number | null
          product_count: number | null
          product_sales_amount: number | null
          requested_amount: number | null
          service_sales_amount: number | null
          service_transaction_amount_spent: number | null
          stripe_client_id: string | null
          subscription_amount_spent: number | null
          subscription_sales_amount: number | null
          total_sales_amount: number | null
          total_spent: number | null
          transaction_count: number | null
          user_thumbnail: string | null
          user_uuid: string
          utm_campaign: string | null
          utm_content: string | null
          utm_id: string | null
          utm_medium: string | null
          utm_source: string | null
          utm_term: string | null
          via: Database["public"]["Enums"]["signup_via"] | null
        }
        Insert: {
          active_product_count?: number | null
          affiliate_fees_amount?: number | null
          affiliate_id?: string | null
          affiliate_link?: string | null
          affiliate_multiplier?: number | null
          affiliate_since?: string | null
          available_amount?: number | null
          average_review?: number | null
          created_at?: string
          email: string
          fees_amount?: number | null
          first_name?: string | null
          id?: number
          is_admin?: boolean | null
          is_affiliate?: boolean | null
          is_member?: boolean | null
          job_amount_spent?: number | null
          job_sales_amount?: number | null
          last_name?: string | null
          member_profile_link?: string | null
          net_sales_amount?: number | null
          payout_amount?: number | null
          product_amount_spent?: number | null
          product_count?: number | null
          product_sales_amount?: number | null
          requested_amount?: number | null
          service_sales_amount?: number | null
          service_transaction_amount_spent?: number | null
          stripe_client_id?: string | null
          subscription_amount_spent?: number | null
          subscription_sales_amount?: number | null
          total_sales_amount?: number | null
          total_spent?: number | null
          transaction_count?: number | null
          user_thumbnail?: string | null
          user_uuid?: string
          utm_campaign?: string | null
          utm_content?: string | null
          utm_id?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
          via?: Database["public"]["Enums"]["signup_via"] | null
        }
        Update: {
          active_product_count?: number | null
          affiliate_fees_amount?: number | null
          affiliate_id?: string | null
          affiliate_link?: string | null
          affiliate_multiplier?: number | null
          affiliate_since?: string | null
          available_amount?: number | null
          average_review?: number | null
          created_at?: string
          email?: string
          fees_amount?: number | null
          first_name?: string | null
          id?: number
          is_admin?: boolean | null
          is_affiliate?: boolean | null
          is_member?: boolean | null
          job_amount_spent?: number | null
          job_sales_amount?: number | null
          last_name?: string | null
          member_profile_link?: string | null
          net_sales_amount?: number | null
          payout_amount?: number | null
          product_amount_spent?: number | null
          product_count?: number | null
          product_sales_amount?: number | null
          requested_amount?: number | null
          service_sales_amount?: number | null
          service_transaction_amount_spent?: number | null
          stripe_client_id?: string | null
          subscription_amount_spent?: number | null
          subscription_sales_amount?: number | null
          total_sales_amount?: number | null
          total_spent?: number | null
          transaction_count?: number | null
          user_thumbnail?: string | null
          user_uuid?: string
          utm_campaign?: string | null
          utm_content?: string | null
          utm_id?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
          via?: Database["public"]["Enums"]["signup_via"] | null
        }
        Relationships: []
      }
      variants: {
        Row: {
          compare_price: number | null
          created_at: string
          highlighted: boolean | null
          id: number
          name: string | null
          price: number | null
          product_uuid: string | null
          user_uuid: string | null
          variant_uuid: string
        }
        Insert: {
          compare_price?: number | null
          created_at?: string
          highlighted?: boolean | null
          id?: number
          name?: string | null
          price?: number | null
          product_uuid?: string | null
          user_uuid?: string | null
          variant_uuid?: string
        }
        Update: {
          compare_price?: number | null
          created_at?: string
          highlighted?: boolean | null
          id?: number
          name?: string | null
          price?: number | null
          product_uuid?: string | null
          user_uuid?: string | null
          variant_uuid?: string
        }
        Relationships: [
          {
            foreignKeyName: "variants_product_uuid_fkey"
            columns: ["product_uuid"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["product_uuid"]
          },
          {
            foreignKeyName: "variants_user_uuid_fkey"
            columns: ["user_uuid"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_uuid"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      affiliate_status: "new" | "accepted" | "needs attention" | "rejected"
      applications_status:
        | "open"
        | "rejected"
        | "pending"
        | "accepted"
        | "withdrawn"
        | "open conversation"
      classroom_status: "visible" | "not visible"
      community_price_status: "active" | "inactive"
      community_subscription_status: "active" | "inactive"
      conversation_source: "template" | "job request" | "information request"
      conversation_status: "open" | "closed" | "need attention"
      job_status:
        | "open"
        | "archived"
        | "closed"
        | "paid"
        | "completed"
        | "pending payment"
        | "disputed"
      payout_status: "requested" | "paid out"
      product_free_or_paid: "free" | "paid"
      product_type: "template" | "guide or manual"
      review_status: "published" | "not published"
      service_price_status: "active" | "inactive"
      service_subscription_status: "active" | "inactive"
      service_type: "one time" | "monthly"
      signup_via:
        | "sign-up"
        | "sign-up community"
        | "guest transaction"
        | "sign-up community paid"
      thread_status: "open" | "closed"
      thread_tag: "general" | "support" | "off topic" | "anouncements"
      ticket_status:
        | "open"
        | "archived"
        | "closed"
        | "requires attention"
        | "in progress"
      ticket_type:
        | "others"
        | "problem with a purchase"
        | "join as seller"
        | "product question"
      transaction_type:
        | "product"
        | "job"
        | "service"
        | "community"
        | "custom request"
      variant_tags: "premium" | "basic"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
