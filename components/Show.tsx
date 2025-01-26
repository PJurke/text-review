/**
 * Interface for the properties of the Show component.
 */
interface ShowProps {
    when: boolean;
    children: React.ReactNode;
}

/**
 * A React component that conditionally renders its children based on a boolean condition.
 * @param {ShowProps} props - The properties of the component.
 * @param {boolean} props.when - If `true`, the children are rendered; otherwise, `null` is returned.
 * @param {React.ReactNode} props.children - The elements to be rendered.
 * @returns {JSX.Element | null} The rendered children or `null` if the condition is not met.
 */
export default function Show({ when, children }: ShowProps): JSX.Element | null {
    return when ? <>{ children }</> : null;
}