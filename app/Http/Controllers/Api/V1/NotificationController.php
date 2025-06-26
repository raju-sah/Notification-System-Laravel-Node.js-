<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Enums\NotificationStatus;
use App\Http\Requests\NotificationPublishRequest;
use App\Jobs\ProcessNotification;
use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class NotificationController extends Controller
{
    public function store(NotificationPublishRequest $request)
    {
        $data = $request->validated();

        // Rate limiting: 10 notifications per user per hour
        $cacheKey = "notification:rate:user:{$data['user_id']}";
        $count = Cache::get($cacheKey, 0);

        if ($count >= 10) {
            return response()->json(['error' => 'Rate limit exceeded'], 429);
        }

        Cache::put($cacheKey, $count + 1, now()->addHour());

        $data['status'] = NotificationStatus::PENDING->value;
        $data['user_id'] = auth('sanctum')->user()->id ?? null;
        if (is_null($data['user_id'])) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }
        ProcessNotification::dispatch($data);

        return response()->json(['message' => 'Notification queued for processing'], 201);
    }

    public function update(Request $request)
    {
        $request->validate([
            'id' => 'required|integer|exists:notifications,id',
            'status' => 'required|string|in:processed,failed',
        ]);

        $notification = Notification::findOrFail($request->id);
        if (!$notification) {
            return response()->json(['error' => 'Notification not found'], 404);
        }
        $notification->update(['status' => $request->status]);

        return response()->json(['message' => 'Status updated', 'notification' => $notification]);
    }
}
