package dto

type Group struct {
	ID        string `json:"id"`
	Name      string `json:"name"`
	WordCount int    `json:"wordCount"`
}

type CreateGroup struct {
	Name string `json:"name"`
}

type UpdateGroup struct {
	ID   string `json:"id"`
	Name string `json:"name"`
}
