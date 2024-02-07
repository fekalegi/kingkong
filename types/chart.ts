export type Chart = {
    weekly_chart_sales: Weekly[];
    weekly_chart_purchase: Weekly[];
    monthly_chart_sales: Monthly[];
    monthly_chart_purchase: Monthly[];
  };
  
type Weekly = {
  day_of_week: number;
  day: string;
  sum: number;
}

type Monthly = {
  month: number;
  month_str: string;
  sum: number;
}