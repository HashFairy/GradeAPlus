import Link from "next/link";

export default function GradePage() {
    return (
        <div>
            <h1>Grades</h1>
            <ul>
                <li><Link href="/grade/1">Year 1</Link></li>
                <li><Link href="/grade/2">Year 2</Link></li>
            </ul>
        </div>
    );
}
