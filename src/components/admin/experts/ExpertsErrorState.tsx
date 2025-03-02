
interface ExpertsErrorStateProps {
  message?: string;
}

export function ExpertsErrorState({ message = "Error loading experts. Please try again later." }: ExpertsErrorStateProps) {
  return (
    <div className="text-center text-red-500 py-8">
      {message}
    </div>
  );
}
