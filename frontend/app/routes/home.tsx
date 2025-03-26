import { TodoList } from "../components/Todo";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
	return [
		{ title: "New React Router App" },
		{ name: "description", content: "Welcome to React Router!" },
	];
}

export default function Home() {
	return (
		<div className="container mx-auto px-4">
			<h1 className="text-2xl font-bold text-center my-8">TODOアプリ</h1>
			<TodoList />
		</div>
	);
}
