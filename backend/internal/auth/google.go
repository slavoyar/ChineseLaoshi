package auth

import (
	"context"
	"fmt"

	"google.golang.org/api/idtoken"
)

type GoogleIdentity struct {
	Subject       string
	Email         string
	EmailVerified bool
	Name          string
	Picture       string
}

type GoogleVerifier struct {
	clientID string
}

func NewGoogleVerifier(clientID string) *GoogleVerifier {
	return &GoogleVerifier{clientID: clientID}
}

func (v *GoogleVerifier) VerifyIDToken(ctx context.Context, rawToken string) (GoogleIdentity, error) {
	payload, err := idtoken.Validate(ctx, rawToken, v.clientID)
	if err != nil {
		return GoogleIdentity{}, fmt.Errorf("invalid google id token: %w", err)
	}

	email, _ := payload.Claims["email"].(string)
	name, _ := payload.Claims["name"].(string)
	picture, _ := payload.Claims["picture"].(string)

	if email == "" || payload.Subject == "" {
		return GoogleIdentity{}, fmt.Errorf("google token missing subject or email")
	}

	return GoogleIdentity{
		Subject:       payload.Subject,
		Email:         email,
		EmailVerified: claimBool(payload.Claims["email_verified"]),
		Name:          name,
		Picture:       picture,
	}, nil
}

func claimBool(v any) bool {
	switch t := v.(type) {
	case bool:
		return t
	case string:
		return t == "true" || t == "1"
	default:
		return false
	}
}
