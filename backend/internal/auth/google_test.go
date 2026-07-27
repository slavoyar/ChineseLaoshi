package auth

import "testing"

func TestClaimBool(t *testing.T) {
	tests := []struct {
		name  string
		input any
		want  bool
	}{
		{"bool true", true, true},
		{"bool false", false, false},
		{"string true", "true", true},
		{"string 1", "1", true},
		{"string false", "false", false},
		{"nil", nil, false},
		{"int", 1, false},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := claimBool(tt.input); got != tt.want {
				t.Fatalf("claimBool(%v) = %v, want %v", tt.input, got, tt.want)
			}
		})
	}
}
