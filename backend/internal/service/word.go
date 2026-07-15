package service

import (
	"context"

	"github.com/slavo/ChineseLaoshi/backend/internal/repository"
	"github.com/slavo/ChineseLaoshi/backend/internal/dto"
)

type WordService struct {
	words *repository.WordRepository
}

func NewWordService(words *repository.WordRepository) *WordService {
	return &WordService{words: words}
}

func (s *WordService) Search(ctx context.Context, query string) ([]dto.Word, error) {
	return s.words.SearchWord(ctx, query)
}
