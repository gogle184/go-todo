package main

import (
	"encoding/json"
	"log"
	"net/http"
	"strconv"
	"sync"
	"time"
)

type Todo struct {
	ID        int    `json:"id"`
	Title     string `json:"title"`
	Completed bool   `json:"completed"`
	CreatedAt time.Time `json:"created_at"`
}

var todos []Todo
var mutex sync.Mutex

func enableCORS(handler http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		handler(w, r)
	}
}

func main() {
	http.HandleFunc("/api/todos", enableCORS(handleTodos))

	log.Printf("Server starting on :8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}

func handleTodos(w http.ResponseWriter, r *http.Request){
	w.Header().Set("Content-Type", "application/json")

	switch r.Method {
	case "GET":
		json.NewEncoder(w).Encode(todos)
	case "POST":
		var todo Todo
		json.NewDecoder(r.Body).Decode(&todo)
		mutex.Lock()
		todo.ID = len(todos) + 1
		todo.CreatedAt = time.Now()
		todos = append(todos, todo)
		mutex.Unlock()
		json.NewEncoder(w).Encode(todo)
	case "PUT":
		var updateTodo Todo
		json.NewDecoder(r.Body).Decode(&updateTodo)
		mutex.Lock()
		for i, todo := range todos {
			if todo.ID == updateTodo.ID {
				todos[i].Title = updateTodo.Title
				todos[i].Completed = updateTodo.Completed
				json.NewEncoder(w).Encode(todos[i])
				mutex.Unlock()
				return
			}
		}
		mutex.Unlock()
		w.WriteHeader(http.StatusNotFound)
	case "DELETE":
		idStr := r.URL.Query().Get("id")
		id, err := strconv.Atoi(idStr)
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			return
		}

		mutex.Lock()
		for i, todo := range todos {
			if todo.ID == id {
				todos = append(todos[:i], todos[i+1:]...)
				mutex.Unlock()
				w.WriteHeader(http.StatusNoContent)
				return
			}
		}
		mutex.Unlock()
		w.WriteHeader(http.StatusNotFound)
	default:
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}
